const { pool } = require('../db');

/**
 * Send a connection request
 */
async function sendRequest(senderId, receiverId) {
    if (senderId === receiverId) {
        throw new Error('Cannot connect to yourself');
    }

    // Check if already connected
    const connCheck = await pool.query(
        'SELECT * FROM connections WHERE (user1_id = $1 AND user2_id = $2) OR (user1_id = $2 AND user2_id = $1)',
        [senderId, receiverId]
    );
    if (connCheck.rows.length > 0) {
        throw new Error('Already connected');
    }

    // Check if request already exists
    const reqCheck = await pool.query(
        'SELECT * FROM connection_requests WHERE sender_id = $1 AND receiver_id = $2 AND status = \'pending\'',
        [senderId, receiverId]
    );
    if (reqCheck.rows.length > 0) {
        throw new Error('Request already sent');
    }

    // Create request
    const result = await pool.query(
        'INSERT INTO connection_requests (sender_id, receiver_id, status) VALUES ($1, $2, \'pending\') ON CONFLICT (sender_id, receiver_id) DO UPDATE SET status = \'pending\', created_at = CURRENT_TIMESTAMP RETURNING *',
        [senderId, receiverId]
    );
    return result.rows[0];
}

/**
 * Get pending requests for a user
 */
async function getIncomingRequests(userId) {
    const result = await pool.query(
        'SELECT * FROM connection_requests WHERE receiver_id = $1 AND status = \'pending\' ORDER BY created_at DESC',
        [userId]
    );
    return result.rows;
}

/**
 * Accept a connection request
 */
async function acceptRequest(requestId, senderId, receiverId) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // Update request status
        await client.query(
            'UPDATE connection_requests SET status = \'accepted\' WHERE id = $1',
            [requestId]
        );

        // Create connection (bidirectional entry not needed since we check both ways, but user1 < user2 is a good pattern)
        const [u1, u2] = senderId < receiverId ? [senderId, receiverId] : [receiverId, senderId];
        await client.query(
            'INSERT INTO connections (user1_id, user2_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
            [u1, u2]
        );

        await client.query('COMMIT');
        return { success: true };
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
}

/**
 * Reject a connection request
 */
async function rejectRequest(requestId) {
    const result = await pool.query(
        'UPDATE connection_requests SET status = \'rejected\' WHERE id = $1 RETURNING *',
        [requestId]
    );
    return result.rows[0];
}

/**
 * Get connection status between two users
 */
async function getConnectionStatus(myId, targetId) {
    // Check if connected
    const [u1, u2] = myId < targetId ? [myId, targetId] : [targetId, myId];
    const conn = await pool.query(
        'SELECT * FROM connections WHERE user1_id = $1 AND user2_id = $2',
        [u1, u2]
    );
    if (conn.rows.length > 0) return 'connected';

    // Check sent request
    const sent = await pool.query(
        'SELECT * FROM connection_requests WHERE sender_id = $1 AND receiver_id = $2 AND status = \'pending\'',
        [myId, targetId]
    );
    if (sent.rows.length > 0) return 'pending_sent';

    // Check received request
    const received = await pool.query(
        'SELECT * FROM connection_requests WHERE sender_id = $1 AND receiver_id = $2 AND status = \'pending\'',
        [targetId, myId]
    );
    if (received.rows.length > 0) return 'pending_received';

    return 'none';
}

/**
 * Remove a connection
 */
async function removeConnection(u1_raw, u2_raw) {
    const [u1, u2] = u1_raw < u2_raw ? [u1_raw, u2_raw] : [u2_raw, u1_raw];
    await pool.query(
        'DELETE FROM connections WHERE user1_id = $1 AND user2_id = $2',
        [u1, u2]
    );
    // Also clean up any lingering requests
    await pool.query(
        'DELETE FROM connection_requests WHERE (sender_id = $1 AND receiver_id = $2) OR (sender_id = $2 AND receiver_id = $1)',
        [u1, u2]
    );
    return { success: true };
}

module.exports = {
    sendRequest,
    getIncomingRequests,
    acceptRequest,
    rejectRequest,
    getConnectionStatus,
    removeConnection
};
