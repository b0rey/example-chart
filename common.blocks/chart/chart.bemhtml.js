block('chart')(
    js()(true),
    content()([
        {
            elem: 'svg',
            tag: 'svg',
            attrs: { width: 960, height: 500 }
        },
        {
            block: 'radio-group',
            mix: { block: 'chart', elem: 'period' },
            mods: { theme: 'islands', size: 'm', type: 'button' },
            name: 'radio-sizes-m',
            val: 'max',
            options: [
                { val: 'week', text: 'Week' },
                { val: 'month', text: 'Month' },
                { val: 'quater', text: 'Quater' },
                { val: 'year', text: 'Year' },
                { val: 'max', text: 'Max' },
            ]
        },
        {
            block: 'select',
            mix: { block: 'chart', elem: 'parameter' },
            mods: { mode: 'radio-check', theme: 'islands', size: 'm' },
            name: 'select',
            val: 'yield',
            options: [
                { val: 'yield', text: 'Yield', checked: true },
                { val: 'spread', text: 'Spread' },
                { val: 'price', text: 'Price' },
            ]
        },
    ])
)
