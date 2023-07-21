import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/db";
import bcrypt from "bcrypt";
import AppError from "../utils/AppErrorGenerator";
import { userSchema } from "../Validation/Users.Validations";

export interface UserModel extends Model {
    id: number,
    FirstName: string;
    LastName: string;
    email: string;
    rool: "seller" | "buyer";
    password: string;
    validateAsync(): Promise<void>;
    authenticate(password: string | Buffer);
}

export const UsersSchema = sequelize.define<UserModel>('userInformation', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    FirstName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    LastName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    FullName: {
        type: DataTypes.VIRTUAL,
        get() {
            return `${this.getDataValue('FirstName')} ${this.getDataValue('LastName')}`
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    rool: {
        type: DataTypes.ENUM,
        allowNull: false,
        values: ["seller", "buyer"]
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    }
}, {
    hooks: {
        beforeValidate: async (user) => {
            user.password = bcrypt.hashSync(user.password, 12);
        }
    }
});
UsersSchema.prototype.validateAsync = async (user: UserModel) => {
    try {
        const userJSON = user.toJSON();
        const value = await userSchema.validateAsync(userJSON);
        return value;
    } catch (error) {
        throw new AppError(`Validation Error - ${error.details[0].message}`, 'invalid_request');
    }
}
UsersSchema.prototype.authenticate = function (value: string | Buffer) {
    if (bcrypt.compareSync(value, this.password)) {
        return this;
    } else {
        return false;
    }
}
