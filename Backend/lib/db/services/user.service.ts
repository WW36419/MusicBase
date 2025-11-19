import Database from '../database';
import {config} from '../../config';
import { IUser } from '../models/user.model';

class UserService {
    private db: Database
    constructor() {
        this.db = new Database(config.db_info)
    }

    public async createNewOrUpdate(user: IUser) {
        console.log(user)
        try {
            if (!user.user_id) {
                const query = "INSERT INTO userbase.profiles (user_name, email) VALUES ($1, $2)"
                const values = [user.name, user.email]
                return await this.db.queryWithParams(query, values);
            } else {
                const query = "UPDATE userbase.profiles SET (user_name, email) = ($1, $2) WHERE user_id=$3"
                const values = [user.name, user.email, user.user_id]
                return await this.db.queryWithParams(query, values);
            }
        } catch (error) {
            console.error('Wystąpił błąd podczas tworzenia danych:', error);
            throw new Error('Wystąpił błąd podczas tworzenia danych');
        }
    }
 
    public async getByEmail(email: string) {
        try {
            const query = "SELECT * FROM userbase.profiles WHERE email = $1"
            const result = await this.db.queryWithParams(query, [email])
            if (result) {return result.rows[0];}
        } catch (error) {
            console.error('Wystąpił błąd podczas pobierania danych:', error);
            throw new Error('Wystąpił błąd podczas pobierania danych');
        }
}
 
    public async getById(id: string) {
        try {
            const query = "SELECT * FROM userbase.profiles WHERE user_id = $1"
            const result = await this.db.queryWithParams(query, [id])
            if (result) {return result.rows[0];}
        } catch (error) {
            console.error('Wystąpił błąd podczas pobierania danych:', error);
            throw new Error('Wystąpił błąd podczas pobierania danych');
        }
    }

} export default UserService;