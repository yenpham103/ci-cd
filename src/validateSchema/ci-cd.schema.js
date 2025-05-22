const { z } = require('zod');

const ciCdServerSchema = z
    .object({
        site_name: z.string().min(1, { message: 'Site name is required and cannot be empty' }),
        remote_server: z.string().min(1, { message: 'Remote server is required and cannot be empty' }),
        config_repo_id: z.number(),
        branch_id: z.string().min(1, { message: 'Branch ID is required and cannot be empty' }),
        application_directory: z.string().min(1, { message: 'Application directory is required and cannot be empty' }),
    })
    .strip();

module.exports = {
    ciCdServerSchema,
};
