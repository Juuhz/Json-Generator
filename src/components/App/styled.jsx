import styled, { css } from 'styled-components';

export const Wrapper = styled.section`
    position: relative;
    max-width: 700px;
    display: block;
    margin: 20px auto;
`;

export const Panel = styled.div`
	position: relative;
	display: block;
	border: 1px solid #FFF;
	padding: 20px;
`;

export const Percent = styled.div`
    font-size: 30px;
    display: inline-block;
    vertical-align: middle;
`;

export const Separador = styled.div`
    width: 1px;
    height: 35px;
    display: inline-block;
    background: #FFF;
    vertical-align: middle;
    margin: 0px 16px;
`;

export const Clock = styled.div`
	display: inline-block;
    vertical-align: middle;
    font-size: 30px;
`;

export const Button = styled.button`
    float: right;
    background: #FFF;
    border: 0px;
    color: #00b9f0;
    padding: 12px 20px;
    outline: none;
    font-size: 15px;
    text-transform: uppercase;
    cursor: pointer;
    display: inline-block;
    margin-top: -4px;
	-webkit-transition: all 0.3s ease-in-out;
	-moz-transition: all 0.3s ease-in-out;
	-o-transition: all 0.3s ease-in-out;
	transition: all 0.3s ease-in-out;
    &:hover,
    &:disabled{
    	opacity: 0.7;
    }

    &:disabled{
		cursor: not-allowed;
    }
`;

export const Log = styled.div`
    display: inline-block;
    vertical-align: middle;
    font-size: 12px;
    background: #000;
    min-height: 300px;
    width: 100%;
    margin-top: 20px;
    padding: 20px;
`;

export const BoxRows = styled.ul`
    margin-bottom: 0px;
    list-style: none;
    padding-left: 0px;
	max-height: 260px;
	overflow-y: auto;

	&::-webkit-scrollbar
		width: 10px
	
	&::-webkit-scrollbar-track
		background: #f1f1f1
	
	&::-webkit-scrollbar-thumb
		background: #333

    li{
        margin-bottom: 7px;
    }
`;