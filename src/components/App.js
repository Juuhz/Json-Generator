/*
	@ Criado por: Reinaldo Amorim
	@ http://reinaldoamorim.com.br
	@ 08/08/2018
*/

import React, { Component } from 'react';
import styled               from "styled-components";
import { 
  Wrapper,
  Panel,
  Percent,
  Separador,
  Clock,
  Button,
  Log,
  BoxRows,
  Row
}                           from './App/styled.jsx';

class App extends Component {

	constructor(props) {
		super(props);

		this.state = {
			endpoint: 	'http://54.207.26.175',
			dir_temp: 	new Date().getTime(),
			generateds: 1,
			percent: 	'0',
			num_init: 	2,
			num_end: 	5566,
			steps: 		2,
			secondsElapsed: 0,
			response: 	[],
			disableBtn: false
		}

		this.incrementer = null;
	}

	// Evento para iniciar a regionalização
	_initRegionalizacao(){

		// Desabilita botão inicial
		this.setState({
			disableBtn: true
		});

		// Adiciona processo no LOG
		this._addRowLog({
			text: 'Iniciando processo de regionalização...'
		});

		// Cria evento para criar a pasta e começar a gerar os jsons
		this._createFolder();

		// Inicia o cronômetro
		this._startClock();

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

	// Formata o tempo do cronômetro
	_formattedSeconds( sec ){
		return Math.floor( sec / 60 ) + ':' + ( '0' + sec % 60 ).slice( -2 );
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
						text: 'Pasta criada com sucesso!',
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
	async _initGeneratorJson(){

		// Adiciona Ação do Download no LOG
		this._addRowLog({
			text: 'Iniciando Downloads dos Jsons...',
			color: 'yellow'
		});

		for ( let i = this.state.num_init; i <= this.state.num_end; i++) {
				
			fetch( `${this.state.endpoint}/generator.php?json=${i}&dir_temp=${this.state.dir_temp}`, {
				mode: 'cors',
			})
			.then(res => res.json())
			.then(
				(result) => {
					if( result.response ){

						// Adiciona Ação do Download no LOG
						/*this._addRowLog({
							text: `Download concluído do Json: ${i}`
						});*/

						// Atualiza os estados novos
						let generateds 	= this.state.generateds + 1,
							percent 	= ( generateds * 100 ) / this.state.num_end,
							steps 		= this.state.steps;
						
						this.setState({
							generateds: generateds,
							percent: parseFloat( percent ).toFixed(2)
						});

						// Caso tenha feito todos os jsons, chama evento para zipa-los.
						if( generateds === this.state.num_end ){

							// Adiciona Ação do Download no LOG
							this._addRowLog({
								text: 'Downloads concluído!',
								color: 'green'
							});

							// Zip os jsons baixados.
							this._zipFolder();
						}

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
						text: 'Faça o download: <a href="'+ result.urlZip +'">regionalização.zip</a>',
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
			nowLog 	= `[${this._addZero( now.getHours() )}:${this._addZero( now.getMinutes() )}:${this._addZero( now.getSeconds() )}]: `;

		row.text = nowLog + row.text;

		// Caso não tenha a key 'color', adiciona uma default
		row.color = row.color ? row.color : 'white';

		// Adiciona no array a nova linha
		let newStateLog = this.state.response.concat( row );

		// Atualiza o estado para exibir na tela
		this.setState({
			response: newStateLog
		});

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

	// Formata data
	_addZero( time ){
		return time < 10 ? '0' + time : time;
	}

	render(){

		let disableBtn = this.state.disableBtn ? 'disabled' : '';

		return(
		  <Wrapper id="MainWrapper">
		  	<Panel>
		  		<Percent>{this.state.percent}%</Percent>
		  		<Separador/>
		  		<Clock>{this._formattedSeconds(this.state.secondsElapsed)}</Clock>

		  		<Button onClick={this._initRegionalizacao.bind(this)} disabled={disableBtn}>Iniciar</Button>
		  	</Panel>

		  	<Log>
		  		<BoxRows id="BoxRows">
		  			{
		  				this.state.response.map( function( row, index ){
		  					return(
		  						<Row key={index} color={row.color} dangerouslySetInnerHTML={{__html: row.text}}></Row>
		  					);
		  				})
		  			}
		  		</BoxRows>
		  	</Log>
		  </Wrapper>
		);
	}
}

export default App;