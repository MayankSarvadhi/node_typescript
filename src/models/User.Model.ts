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
    } catch (error) {
        throw new AppError(`Validation Error - ${error.details[0].message}`, 'invalid_request');
    }
}
UsersSchema.prototype.authenticate = function (value, user) {
    if (bcrypt.compareSync(value, this.password)) {
        return user.password
    } else {
        return false;
    }
}
