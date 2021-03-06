var httpModule = require("http");
var framesModule = require("ui/frame");
var observableModule = require("data/observable");
var model = new observableModule.Observable();
var dataFechamento;

exports.pageLoaded = function(args) {
    var page = args.object;
    page.bindingContext = model;
    carregaInformacoes();
};

exports.buscaTimes = function() {
	framesModule.topmost().navigate('/views/busca-time/busca-time');
};

exports.jogosDaRodada = function() {
	var context = {
		moduleName: '/views/jogos-rodada/jogos-rodada',
		context: { rodada: model.get('rodadaAtual') },
		animated: true
	};

	framesModule.topmost().navigate(context);
};

function carregaInformacoes() {
	httpModule.getJSON('https://api.cartolafc.globo.com/mercado/status')
				.then(function(retorno){
					contaFechamento(retorno.fechamento.ano, retorno.fechamento.mes, retorno.fechamento.dia, retorno.fechamento.hora, retorno.fechamento.minuto);
					
					model.set('rodadaAtual', retorno.rodada_atual);
					model.set('rodada', 'Rodada ' + retorno.rodada_atual);
				});
}

function contaFechamento(ano, mes, dia, hora, minutos) {
	dataFechamento = new Date(ano, mes, dia, hora, minutos, 0, 0).getTime();

	setInterval(function () {
		model.set('fechamento', contagemRegressiva());
	}, 1000);
}

function contagemRegressiva() {
	var dataAtual = new Date().getTime();
    var sr = (dataFechamento - dataAtual) / 1000;
    var h, m, s;
 
    sr = sr % 86400;
     
    h = parseInt(sr / 3600);
    sr = sr % 3600;
     
    m = parseInt(sr / 60);
    s = parseInt(sr % 60);
     
    return h + ":" + m + ":" + s;  
}