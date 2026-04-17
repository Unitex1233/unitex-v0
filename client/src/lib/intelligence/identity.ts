// Unique Identity Engine
// Generates globally unique handles and identifiers for nodes in the mesh.

export function generateUsercode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

export function generateSafeHandle(baseName: string, collisionCount: number = 0): string {
    const cleanName = baseName.toLowerCase().replace(/[^a-z0-9]/g, '_');
    if (collisionCount === 0) {
        return `@${cleanName}`;
    }
    return `@${cleanName}_${Math.floor(100 + Math.random() * 899)}`;
}
