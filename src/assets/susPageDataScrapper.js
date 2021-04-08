// Utilize este script na página
// https://susanalitico.saude.gov.br/extensions/covid-19_html/covid-19_html.html

// Pegue o resultado do console e salve na pasta assets.

// Lembre-se de sempre executar o script com um console separado da página.

const baixarDadosPorEstado = () => {
    const downloadJSON = (filename, object) => {
        const text = JSON.stringify(object, null, 4);
        var pom = document.createElement('a');
        pom.setAttribute('href', 'data:application/json;charset=utf-8,' + encodeURIComponent(text));
        pom.setAttribute('download', filename);
    
        if (document.createEvent) {
            var event = document.createEvent('MouseEvents');
            event.initEvent('click', true, true);
            pom.dispatchEvent(event);
        }
        else {
            pom.click();
        }
    }

    document.getElementById('btEstado').click();
    document.getElementById('QvTbEstado').style.minHeight = "5000px";
    [...document.getElementById('QvTbEstado').getElementsByClassName('lui-button')].forEach(bt => bt.click());

    setTimeout(() => {
        const rows = [
            ...document.getElementById('QvTbEstado')
                .getElementsByClassName('qv-inner-object')[0]
                .getElementsByTagName('table')[1]
                .getElementsByTagName('tbody')[0]
                .children
        ];

        const extractedData = rows.map(r => [...r.children].filter((_, index) => ([0,1,3,6].contains(index)))
            .map(c => c.getElementsByTagName('span')[0].innerText));

        const headers = ['state', 'population', 'cases', 'deaths'];

        const finalData = extractedData.map(r => r.map((v, index) => ({
                [headers[index]]: index === 0 ? v : Number(v.replace(/\./g, '')
            )})).reduce((acc, curr) => ({...acc, ...curr}), {}));

        downloadJSON(`sus_covid_latest_data_${new Date().toISOString().split('T')[0]}`, finalData);

    }, 5000);
}

baixarDadosPorEstado();