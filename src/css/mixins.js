/** Example

module.exports = {
    FontHeadline: function () {
        return {
            "font-family": '$font-verdana',
            "font-weight": '400',

            '@media (max-device-width: 1024px)': {
                'font-family': '$font-hv-bold',
                'font-weight': '700'
            },
            '@media (max-device-width: 2048px) and (min-resolution: 2dppx)': {
                'font-family': '$font-hv-bold',
                'font-weight': '700'
            }
        }
    }
};

**/