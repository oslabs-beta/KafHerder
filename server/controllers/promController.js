const promController = {}

promController.getMetrics = async (req, res, next) => {
    try {
        const response = await fetch('http://localhost/:9090');
        const metrics = await response.json();
        res.locals.metrics = metrics;
    }
    catch (err) {
        console.log(err);
    }
}

module.exports = promController;