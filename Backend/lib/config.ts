export const config = {
    port: process.env.PORT || 3100,
    JwtSecret: "NGTds8mhG5aZ",
    db_info: {
        user: 'postgres',
        password: 'mbase90l',
        host: 'postgres',
        port: 5432,
        database: 'musicbase',
    }
};