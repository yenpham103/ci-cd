const labelReleaseNoteService = require('../services/labelReleaseNote.service');

module.exports = {
    async getAll(ctx) {
        try {
            ctx.body = await labelReleaseNoteService.getAll();
        } catch (error) {
            ctx.status = 500;
            ctx.body = { error: error.message };
        }
    },
    async getById(ctx) {
        try {
            const note = await labelReleaseNoteService.getById(ctx.params.id);
            if (!note) {
                ctx.status = 404;
                ctx.body = { error: 'Release note not found' };
                return;
            }
            ctx.body = note;
        } catch (error) {
            ctx.status = 500;
            ctx.body = { error: error.message };
        }
    },
    async update(ctx) {
        try {
            const [affectedNoteRows] = await labelReleaseNoteService.update(ctx.params.id, ctx.request.body);
            if (!affectedNoteRows) {
                ctx.status = 404;
                ctx.body = { error: 'Release note not found' };
                return;
            }
            ctx.body = affectedNoteRows;
        } catch (error) {
            ctx.status = 500;
            ctx.body = { error: error.message };
        }
    },
    async create(ctx) {
        try {
            const { title, description, date, showCTA, buttonContent, buttonURL } = ctx.request.body;
            if (!title || !description || !date) {
                ctx.status = 400;
                ctx.body = { error: 'Title, description and date are required' };
                return;
            }
            ctx.body = await labelReleaseNoteService.create({
                title,
                description,
                date,
                showCTA,
                buttonContent,
                buttonURL,
            });
        } catch (error) {
            ctx.status = 500;
            ctx.body = { error: error.message };
        }
    },
    async delete(ctx) {
        try {
            const deletedNoteRow = await labelReleaseNoteService.delete(ctx.params.id);
            if (!deletedNoteRow) {
                ctx.status = 404;
                ctx.body = { error: 'Release note not found' };
                return;
            }
            ctx.body = { message: 'Deleted successfully' };
        } catch (error) {
            ctx.status = 500;
            ctx.body = { error: error.message };
        }
    },
};
