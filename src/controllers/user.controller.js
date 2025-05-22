const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const logger = require('../log');
const { createError } = require('../utils/error');
const UserService = require('../services/user.service');
const PermissionService = require('../services/permission.service');
const UserActivityLogService = require('../services/user_activity_log.service');
const EmailService = require('../services/email.service');
const { convertPermissionsArrayToObject, convertPermissionObjectToArray } = require('../utils/convertPermission');
const { generateOTP, getEmailHtml } = require('../utils/common');
const userService = require('../services/user.service');

module.exports = {
    getList: async (ctx) => {
        const { query, userData } = ctx.request;
        const { limit, page, name, email, rel, role } = query;
        const _page = page && parseInt(page);
        const _limit = limit && parseInt(limit);

        try {
            const users = await UserService.findAll({
                name,
                email,
                limit: _limit,
                offset: _page && _limit && (_page - 1) * _limit,
                role,
                deleted: rel === 'deleted',
            });

            ctx.body = {
                status: 'success',
                data: users.rows,
                pagination: {
                    limit: _limit,
                    page: _page,
                    totalRecords: users.count,
                },
            };
            logger.debug(__filename, 'Get list success', userData.name);
        } catch (error) {
            logger.error(__filename, error.message, userData.name);
            ctx.throw(error.status, error.message);
        }
    },
    getById: async (ctx) => {
        const { params, userData } = ctx.request;
        const { id } = params;

        try {
            const user = await UserService.findById(id, {
                attributes: { exclude: ['password', 'token'] },
            });

            if (!user) {
                throw createError(404, 'User not found');
            }

            const userConvert = user.get({ plain: true });

            ctx.body = {
                status: 'success',
                data: {
                    ...userConvert,
                    permission: convertPermissionObjectToArray(user.permission),
                },
            };
            logger.debug(__dirname, 'Get user success', userData.name);
        } catch (error) {
            logger.error(__filename, error.message, userData.name);
            ctx.throw(error.status, error.message);
        }
    },
    getInfo: async (ctx) => {
        const { query, userData } = ctx.request;
        const { models } = query;

        try {
            const user = await UserService.findById(
                userData.id,
                {
                    attributes: { exclude: ['password', 'token'] },
                },
                models
            );
            if (!user) {
                throw createError(404, 'User not found');
            }

            const userConvert = user.get({ plain: true });

            ctx.body = {
                status: 'success',
                data: {
                    ...userConvert,
                    permission: convertPermissionObjectToArray(user.permission),
                },
            };
            logger.debug(__filename, 'Get info success', userData.name);
        } catch (error) {
            logger.error(__filename, error.message, userData.name);
            ctx.throw(error.status, error.message);
        }
    },
    create: async (ctx) => {
        const { body, userData } = ctx.request;
        const { email, password, passwordConfirm, name, role, permission } = body;

        try {
            if (!email || !password || !name) {
                throw createError(400, 'Invalid email or password or information');
            }

            if (password !== passwordConfirm) {
                throw createError(400, 'Password not match');
            }

            const user = await UserService.findByEmailOrNameWithDeleted({ email, name });

            if (user && user.id) {
                throw createError(400, 'Email or name already used');
            }

            // Good
            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(password, salt);
            const newUser = await UserService.create({
                email,
                password: hashPassword,
                name,
                role,
            });

            await PermissionService.create({
                user_id: newUser.id,
                permissions: convertPermissionsArrayToObject(permission),
            });

            ctx.body = {
                status: 'success',
                message: 'User create successfully',
            };
            logger.info(__filename, `User ${name} create success`, userData.name);
        } catch (error) {
            logger.error(__filename, error.message, userData.name);
            ctx.throw(error.status, error.message);
        }
    },
    login: async (ctx) => {
        const { email, password } = ctx.request.body;

        try {
            if (!email || !password) {
                throw createError(400, 'Invalid email or password');
            }

            const user = await UserService.findByEmail({ email, models: ['permissions'] });
            if (!user) {
                throw createError(400, 'Incorrect email or password');
            }

            const isWatch = await bcrypt.compare(password, user.password);
            if (!isWatch) {
                throw createError(400, 'Incorrect email or password');
            }

            // Create token
            const accessToken = await jwt.sign(
                {
                    userId: user.id,
                    userName: user.name,
                    userRole: user.role,
                },
                process.env.ACCESS_TOKEN_SECRET,
                {
                    expiresIn: process.env.ACCESS_TOKEN_LIFE,
                }
            );

            // Save token to database
            await UserService.update({ id: user.id }, { token: accessToken });
            ctx.body = {
                status: 'success',
                data: accessToken,
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    token: accessToken,
                    role: user.role,
                    permission: convertPermissionObjectToArray(user.permission),
                },
            };
            logger.info(__filename, 'Login success', user.name);
        } catch (error) {
            logger.error(__filename, error.message, email);
            ctx.throw(error.status, error.message);
        }
    },
    loginWithGoogle: async (ctx) => {
        const { identityData } = ctx.request.body;

        if (!identityData.access_token || !identityData.token_type) {
            throw createError(400, 'Invalid accessToken or tokenType');
        }

        try {
            const googleUserProfile = await userService.getGoogleUserProfile(identityData);
            if (!googleUserProfile) {
                throw createError(401, 'Unauthorized');
            }
            const user = await UserService.findByEmail({ email: googleUserProfile.email, models: ['permissions'] });
            if (!user) {
                throw createError(400, 'There is no user with this email');
            }

            // Create token
            const accessToken = jwt.sign(
                {
                    userId: user.id,
                    userName: user.name,
                    userRole: user.role,
                },
                process.env.ACCESS_TOKEN_SECRET,
                {
                    expiresIn: process.env.ACCESS_TOKEN_LIFE,
                }
            );

            // Save token to database
            await UserService.update({ id: user.id }, { token: accessToken });
            ctx.body = {
                status: 'success',
                data: accessToken,
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    token: accessToken,
                    role: user.role,
                    permission: convertPermissionObjectToArray(user.permission),
                },
            };
            logger.info(__filename, 'Login success', user.name);
        } catch (error) {
            logger.error(__filename, error.message);
            ctx.throw(error.status, error.message);
        }
    },
    block: async (ctx) => {
        const { params, userData } = ctx.request;
        const { id } = params;

        try {
            const blockUser = await UserService.delete(id);
            if (!blockUser) {
                throw createError(404, 'User not found');
            }

            ctx.body = {
                status: 'success',
                message: 'Block user OK',
            };
            logger.info(__filename, `User-${id} block success`, userData.name);
        } catch (error) {
            logger.error(__filename, error.message, userData.name);
            ctx.throw(error.status, error.message);
        }
    },
    logout: async (ctx) => {
        const { userData } = ctx.request;

        try {
            const logoutUser = await UserService.update({ id: userData.id }, { token: '' });

            if (!logoutUser) {
                throw createError(404, 'User not found');
            }

            ctx.body = {
                status: 'success',
                message: 'User logout successfully',
            };
            logger.info(__filename, 'User logout success', userData.name);
        } catch (error) {
            logger.error(__filename, error.message, userData.name);
            ctx.throw(error.status, error.message);
        }
    },
    destroy: async (ctx) => {
        const { params, userData } = ctx.request;
        const { id } = params;

        try {
            await UserActivityLogService.actionDelete({ user_id: id, creator: userData.name });
            const destroyUser = await UserService.destroy(id);

            if (!destroyUser) {
                throw createError(404, 'User not found');
            }

            ctx.body = {
                status: 'success',
                message: 'Destroy user success',
            };
            logger.info(__filename, `User-${id} destroy success`, userData.name);
        } catch (error) {
            logger.error(__filename, error.message, userData.name);
            ctx.throw(error.status, error.message);
        }
    },
    update: async (ctx) => {
        const { params, body, userData } = ctx.request;
        const { id } = params;
        const { name, email, role, permission } = body;

        try {
            let optionData = {
                role,
            };
            if (email || name) {
                const user = await UserService.findByEmailOrNameWithDeleted({ email, name });
                if (user && user.id) {
                    throw createError(400, 'Email or name already used');
                }
                if (name) {
                    optionData.name = name;
                    await UserActivityLogService.actionUpdate({ user_id: id, creator: userData.name });
                }
                if (email) {
                    optionData.email = email;
                }
            }

            await UserService.update({ id }, optionData);
            const foundPermission = await PermissionService.findByUserId({ user_id: id });
            if (foundPermission) {
                await PermissionService.update({
                    user_id: id,
                    permissions: convertPermissionsArrayToObject(permission),
                });
            } else {
                await PermissionService.create({
                    user_id: id,
                    permissions: convertPermissionsArrayToObject(permission),
                });
            }

            ctx.body = {
                status: 'success',
                message: 'Update user success',
            };
            logger.info(__filename, `User-${id} update success`, userData.name);
        } catch (error) {
            logger.error(__filename, error.message, userData.name);
            ctx.throw(error.status, error.message);
        }
    },
    restore: async (ctx) => {
        const { params, userData } = ctx.request;
        const { id } = params;

        try {
            await UserService.restore(id);

            ctx.body = {
                status: 'success',
                message: 'Restore user success',
            };
            logger.info(__filename, `User-${id} restore success`, userData.name);
        } catch (error) {
            logger.error(__filename, error.message, userData.name);
            ctx.throw(error.status, error.message);
        }
    },
    changePassword: async (ctx) => {
        const { body, userData } = ctx.request;
        const { oldPassword, newPassword, confirmPassword } = body;

        try {
            const user = await UserService.findById(userData.id);
            if (!user || !user.id) {
                throw createError(400, 'User not found');
            }

            const isWatch = await bcrypt.compare(oldPassword, user.password);
            if (!isWatch) {
                throw createError(400, 'Password not match');
            }

            if (newPassword !== confirmPassword) {
                throw createError(400, 'Confirm password not match');
            }

            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(newPassword, salt);
            await UserService.update({ id: user.id }, { password: hashPassword });

            ctx.body = {
                status: 'success',
                message: 'Change password success',
            };
            logger.info(__filename, 'Change password success', userData.name);
        } catch (error) {
            logger.error(__filename, error.message, userData.name);
            ctx.throw(error.status, error.message);
        }
    },
    bulkCreate: async (ctx) => {
        const { body, userData } = ctx.request;
        const { users } = body;

        try {
            if (!users || users.length === 0) {
                throw createError(400, 'User list empty');
            }

            const insertErrors = [];

            for (const user of users) {
                const { name, password, email, role, permission } = user;

                if (!name || !password || !email) {
                    insertErrors.push(user);
                    continue;
                }

                const checkExisted = await UserService.findByEmailOrNameWithDeleted({ email, name });

                if (checkExisted && checkExisted.id) {
                    insertErrors.push(user);
                    continue;
                }

                // OK
                const salt = await bcrypt.genSalt(10);
                const hashPassword = await bcrypt.hash(password.toString(), salt);
                const newUser = await UserService.create({
                    email,
                    password: hashPassword,
                    name,
                    role,
                });

                await PermissionService.create({
                    user_id: newUser.id,
                    permissions: convertPermissionsArrayToObject(permission),
                });
            }

            ctx.body = {
                status: 'success',
                error: insertErrors,
            };
            logger.info(__filename, `Users create success`, userData.name);
        } catch (error) {
            logger.error(__filename, error.message, userData.name);
            ctx.throw(error.status, error.message);
        }
    },
    verifyEmail: async (ctx) => {
        const { email } = ctx.request.body;
        try {
            if (!email && !email.trim().length) {
                throw createError(400, 'Email is required!');
            }

            const user = await UserService.findByEmail({ email });

            if (!user || !user.id) {
                throw createError(404, 'User not found!');
            }
            const otp = generateOTP();
            const sendEmailRes = await EmailService.sendEmail({
                toAddress: user.email,
                subject: `[TECH HUB]: OTP forgot password`,
                sourceEmail: 'no-reply@email-bsscommerce.com',
                replyToAddress: null,
                htmlData: getEmailHtml(otp),
            });

            const sendMailResJson = await sendEmailRes.json();
            if (!sendMailResJson.success) {
                throw createError(400, 'Sent OTP to your email failed!');
            }

            const expiration_time = new Date(new Date().setMinutes(new Date().getMinutes() + 5));
            await UserService.setOtpCache({ userId: user.id, otp, expiration_time });

            ctx.body = {
                status: 'success',
                message: 'Sent OTP to your email success!',
            };
        } catch (error) {
            logger.error(__filename, error.message, `email: ${email}`);
            ctx.throw(error.status, error.message);
        }
    },
    verifyOtp: async (ctx) => {
        const { otp, email } = ctx.request.body;
        try {
            if (!email && !email.trim().length) {
                throw createError(400, 'Email is required!');
            }
            if (!otp && !otp.trim().length) {
                throw createError(400, 'OTP is required!');
            }
            if (otp.trim().length < 6) {
                throw createError(400, 'Invalid OTP!');
            }
            const user = await UserService.findByEmail({ email });
            if (!user || !user.id) {
                throw createError(400, 'User not found!');
            }

            const userOtp = await UserService.getOtpCache({ userId: user.id });
            if (Number(otp) !== Number(userOtp.otp)) {
                throw createError(400, 'OTP not match!');
            }

            const expirationTime = new Date(userOtp.expiration_time);
            const currentTime = new Date();
            const timeDifference = expirationTime - currentTime;
            const timeDifferenceInMinutes = timeDifference / (1000 * 60);

            if (timeDifferenceInMinutes > 5) {
                throw createError(400, 'OTP expired time!');
            }

            const keyPair = UserService.generateKeyPair({ user });
            ctx.body = {
                status: 'success',
                message: 'Valid OTP!',
                keyPair,
            };
        } catch (error) {
            logger.error(__filename, error.message, `email: ${email}`);
            ctx.throw(error.status, error.message);
        }
    },
    forgotPassword: async (ctx) => {
        const { email, keyPair, password, renewPassword } = ctx.request.body;
        try {
            if (!email && !email.trim().length) {
                throw createError(400, 'Email is required!');
            }

            if (!password && !password.trim().length) {
                throw createError(400, 'Password is required!');
            } else if (password.trim().length < 6) {
                throw createError(400, 'Password must be more than 6 characters');
            }

            if (!renewPassword && !renewPassword.trim().length) {
                throw createError(400, 'Renew password is required!');
            } else if (renewPassword.trim().length < 6) {
                throw createError(400, 'Renew password must be more than 6 characters');
            }

            if (password !== renewPassword) {
                throw createError(400, 'Confirm password not match!');
            }

            const user = await UserService.findByEmail({ email });
            if (!user || !user.id) {
                throw createError(404, 'User not found!');
            }

            const userKeyPair = UserService.generateKeyPair({ user });
            if (keyPair !== userKeyPair) {
                throw createError(400, 'Not authentication!');
            }

            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(password, salt);
            await UserService.update(
                {
                    email,
                },
                {
                    email,
                    password: hashPassword,
                }
            );
            ctx.body = {
                status: 'success',
                message: 'Update new password ok!',
            };
        } catch (e) {
            logger.error(__filename, e.message, `email: ${email}`);
            ctx.throw(e.status, e.message);
        }
    },

    getListCSE: async (ctx) => {
        const { userData } = ctx.request;

        try {
            const users = await UserService.findAll({
                role: 'cse',
            });

            ctx.body = {
                status: 'success',
                data: users,
            };
            logger.debug(__filename, 'Get list cse success', userData.name);
        } catch (error) {
            logger.error(__filename, error.message, userData.name);
            ctx.throw(error.status, error.message);
        }
    },
};
