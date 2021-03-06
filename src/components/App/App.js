/*
	@ Criado por: Reinaldo Amorim
	@ http://reinaldoamorim.com.br
	@ 08/08/2018
	
	------------------------------

	@ Versão atual: 1.0.3
	@ Homologada: 17/01/2019
*/

import React, { Component } from 'react';
import { 
	// Container
  		Wrapper,

  	// Loading
  		Loading,

  	// Alert
		AlertUpdate,

  	// Painel
		Panel,
		Percent,
		Separador,
		Clock,
		Button,

	// Log
		Log,
		BoxRows,

  	// Footer
  		Logo,
  		Version,
  		Copy,
}                           from './styled.js';
import {
	addZero,
	formattedSeconds,
	getVersion,
	verifyVersion,
}							from '../../utils/index.js'

class App extends Component {

	constructor(props) {
		super(props);

		this.state = {
			endpoint: 		'http://54.207.26.175',
			dir_temp: 		new Date().getTime(),
			generateds: 	1,
			percent: 		'0',
			num_init: 		2,
			num_end: 		5566,
			secondsElapsed: 0,
			disableBtn: 	false,
			btnText: 		'Iniciar',
			errosDown: 		[],
			refactor: 		false,
			version: 		getVersion(),
			hasUpdate: 		false,
			preVerify: 		true,
		}

		this.incrementer = null;
	}

	// Evento para iniciar a regionalização
	_initRegionalizacao(){

		// Desabilita botão inicial
		this.setState({
			disableBtn: true
		});

		// Inicia o cronômetro
		this._startClock();

		// Caso não seja refatoramento
		if( !this.state.refactor ){

			// Cria evento para criar a pasta e começar a gerar os jsons
			this._createFolder();

		}else{ // Caso seja

			// Inicia processo de refatoramento
			this._initRefactor();

		}

	}

	// Evento para iniciar o cronômetro
	_startClock() {
		
		this.incrementer = setInterval( () =>
			this.setState({
				secondsElapsed: this.state.secondsElapsed + 1
			})
		, 1000);
	}

	// Evento pra parar o cronômetro
	_stopClock() {

		clearInterval(this.incrementer);
		this.setState({
			lastClearedIncrementer: this.incrementer
		});

	}

	// Evento para criar a pasta temporária para salvar os jsons gerados
	_createFolder(){

		// Adiciona Ação da criação da pasta no LOG
		this._addRowLog({
			text: 'Criando pasta para armazenar os jsons gerados no servidor...',
			color: 'yellow'
		});

		fetch( `${this.state.endpoint}/folder.php?dir_temp=${this.state.dir_temp}`, {
			mode: 'cors',
		})
		.then(res => res.json())
		.then(
			(result) => {
				if( result.response ){

					// Adiciona Ação da criação da pasta no LOG
					this._addRowLog({
						text: `Pasta criada com sucesso! ID: ${this.state.dir_temp}`,
						color: 'green'
					});

					// Chama evento para iniciar a geração dos Jsons
					this._initGeneratorJson();

				}else{

					// Adiciona erro no LOG
					this._addErrorLog( result.msg );

				}
			},
			(error) => {

				// Adiciona erro no LOG
				this._addErrorLog( 'Erro ao criar pasta no servidor.' );

			}
		);

	}

	// Evento para iniciciar a geração dos jsons
	_initGeneratorJson(){

		// Adiciona processo no LOG
		this._addRowLog({
			text: 'Iniciando processo de regionalização...'
		});

		// Adiciona Ação do Download no LOG
		this._addRowLog({
			text: 'Iniciando Downloads dos Jsons...',
			color: 'yellow'
		});

		for ( let i = this.state.num_init; i <= this.state.num_end; i++) {
			
			// Execulta o fetch para consumir o webservice
			this._fetch( i, false, this.state.num_end );

		}

	}

	// Evento para iniciar a refatoração dos jsons que deram erros
	_initRefactor(){

		// Adiciona processo no LOG
		this._addRowLog({
			text: 'Iniciando processo de refatoramento...'
		});

		// Adiciona Ação do Download no LOG
		this._addRowLog({
			text: 'Iniciando Downloads dos Jsons que apresentaram IDs duplicados...',
			color: 'yellow'
		});

		// Atualiza estado
		this.setState({
			refactor: false
		});

		let lastItem 	= this.state.errosDown.length;

		this.state.errosDown.forEach( function( json, key ){
			
			// Execulta o fetch para consumir o webservice
			this._fetch( json, key, lastItem );

		}.bind(this));

	}

	// Evento para realizar a lógica e consumir o webservice ( API )
	async _fetch( json, key, lastItem ){

		fetch( `${this.state.endpoint}/generator.php?json=${json}&dir_temp=${this.state.dir_temp}&last_json=${lastItem}`, {
			mode: 'cors',
		})
		.then(res => res.json())
		.then(
			(result) => {

				if( result.response ){

					// Adiciona Ação do Download no LOG
					this._addRowLog({
						text: `Download concluído do Json: ${json}`
					});

					// Atualiza os estados novos
					let generateds 	= this.state.generateds + 1,
						percent 	= ( generateds * 100 ) / this.state.num_end;
					
					this.setState({
						generateds: generateds,
						percent: parseFloat( percent ).toFixed(2)
					});

				}else{

					// Caso a Key não exista, ele não está fazendo refatoramento
					if( key === false ){

						// Adiciona no array a nova linha
						let errosDown = this.state.errosDown.concat( json );

						// Atualiza estado com o novo array de erros ( jsons )
						this.setState({
							errosDown: errosDown
						});

					}

					// Adiciona erro no LOG
					this._addErrorLog( result.msg );

				}

				//Caso seja a última requisição
				if( result.isLastJson ){

					// Caso tenha feito todos os jsons, chama evento para zipa-los.
					if( this.state.generateds === this.state.num_end ){

						// Adiciona Ação do Download no LOG
						this._addRowLog({
							text: 'Downloads concluído!',
							color: 'green'
						});

						// Zip os jsons baixados.
						this._zipFolder();

					}else{ // Caso tenha completado, mas não baixou todos, houve erro

						let erroMsg = "Os seguintes jsons apresentaram IDs duplicados: <br><br>";

						this.state.errosDown.forEach( function( json ){
							erroMsg += `- ${json}.json <br>`;
						});

						erroMsg += "<br>";

						// Adiciona jsons com erro no LOG
						this._addErrorLog( erroMsg );

						// Informa como ajustar o erro e oque o usuário tem que fazer
						this._addRowLog({
							text: 'Ajuste estes erros no CMS e clique em "Refatorar" para baixar apenas estes jsons e gerar o zip para download com toda a regionalização.',
							color: 'yellow'
						});	

						// Muda texto do botão
						this.setState({
							btnText: 'Refatorar',
							refactor: true
						});

					}

				}

			},
			(error) => {

				// Adiciona erro no LOG
				this._addErrorLog( `Falha ao baixar o json: ${json}.json | Servidor retornou erro 500.` );

			}
		);

	}

	// Evento para zipar a pasta com os jsons
	_zipFolder(){

		// Adiciona Ação do ZIP no LOG
		this._addRowLog({
			text: 'Iniciando a compactação dos jsons para download...',
			color: 'yellow'
		});

		fetch( `${this.state.endpoint}/zip.php?dir_temp=${this.state.dir_temp}&num_init=${this.state.num_init}&num_end=${this.state.num_end}`, {
			mode: 'cors',
		})
		.then(res => res.json())
		.then(
			(result) => {
				if( result.response ){

					// Adiciona Ação do ZIP no LOG
					this._addRowLog({
						text: 'Compactação concluída!',
						color: 'green'
					});

					// Adiciona download do ZIP lo LOG
					this._addRowLog({
						text: 'Faça o download: <a href="'+ result.urlZip +'" style="color: DodgerBlue">regionalização.zip</a>',
						color: 'DodgerBlue'
					});

					// Habilita botão inicial
					this.setState({
						disableBtn: true
					});

					//Pausa Cronômetro
					this._stopClock();

				}else{

					// Adiciona erro no LOG
					this._addErrorLog( result.msg );

				}
			},
			(error) => {

				// Adiciona erro no LOG
				this._addErrorLog( 'Erro ao criar pasta no servidor.' );

			}
		);

	}

	// Evento para adicionar linhas no LOG
	_addRowLog( row ){

		// Adiciona horário no LOG
		let now 	= new Date(),
			rowTxt 	= `[${addZero( now.getHours() )}:${addZero( now.getMinutes() )}:${addZero( now.getSeconds() )}]: ${row.text}`;

		// Adiciona na lista do LOG
		let newRow 	= 	document.createElement("li");

		newRow.innerHTML 	= rowTxt;
		newRow.style.color 	= row.color ? row.color : 'white';
	    
	    document.getElementById( "BoxRows" ).appendChild( newRow ); 

		// Deixa o scroll sempre no botttom para pegar os novos elementos sempre
		let objDiv = document.getElementById("BoxRows");
			objDiv.scrollTop = objDiv.scrollHeight;
	}

	// Evento para dicionar erro ao LOG
	_addErrorLog( error ){

		// Habilita botão inicial
		this.setState({
			disableBtn: false
		});

		// Exibe erro no LOG
		this._addRowLog({
			text: error,
			color: 'red'
		});

		// Pausa Cronômetro
		this._stopClock();

	}

	// Renderiza aplicação
	_renderApp(){

		if( this.state.preVerify ){ // Loading enquanto verifica se há atualização

			return(
				<Wrapper id="MainWrapper">
					<Loading>Carregando... Aguarde.</Loading>
				</Wrapper>
			)

		}else if( !this.state.preVerify && this.state.hasUpdate ){ // Caso tenha

			return(

				<Wrapper id="MainWrapper">
					<AlertUpdate>
						<strong>Atenção:</strong> Há atualizações pendentes. Dê um <i>PULL</i> no projeto para puxar as atualizações. Após o <i>PULL</i>, rode o projeto novamente com o <i>NPM START</i>.
						<br />
						<br />
						OBS: Caso o projeto apresente erros ao iniciar, rode o comando: <i>NPM INSTALL</i>.
					</AlertUpdate>
				</Wrapper>

			)

		}else{ // Caso o projeto esteja 100% atualizado.

			let disableBtn = this.state.disableBtn ? 'disabled' : '';

			return(

				<div>
					<Wrapper id="MainWrapper">
						<Panel>
							<Percent>{this.state.percent}%</Percent>
							<Separador/>
							<Clock>{formattedSeconds(this.state.secondsElapsed)}</Clock>

							<Button onClick={this._initRegionalizacao.bind(this)} disabled={disableBtn}>{this.state.btnText}</Button>
						</Panel>
						<Log>
							<BoxRows id="BoxRows" />
						</Log>
						<Logo><img src="./logo.svg" alt="Logo Json Generator" title="Json Generator | Apoio para regionalização VML" /></Logo>
						<Version title="Consulte o arquivo Changelog.">v{this.state.version}</Version>
					</Wrapper>
					<Copy>
						Desenvolvido por: <a href="http://reinaldoamorim.com.br/?ref=json-generator" target="_blank">Reinaldo Amorim</a>
					</Copy>
				</div>

			)

		}

	}

	// Evento que é execultado no fim do componente
	componentDidMount(){

		// Verifica se há uma versão nova do projeto
		verifyVersion().then( (result) => {

			const curVersion = atob(result.content).split( '=' )[1].trim();

			if( curVersion !== getVersion() ){

				// Atualiza novo estado
				this.setState({
					hasUpdate: true,
					preVerify: false
				});

			}else{

				// Atualiza novo estado
				this.setState({
					preVerify: false
				});

			}

		});

	}

	// Renderiza componente
	render(){
		return( this._renderApp() );
	}
}

export default App;