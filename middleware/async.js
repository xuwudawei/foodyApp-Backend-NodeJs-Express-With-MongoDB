module.exports=function asyncMiddleware(Handler) {
    return async (req, res, next) => {
        try {
            await Handler(req, res);
        } catch (ex) {
            next(ex);
        };
    }
}