import styled from 'styled-components';

// Container
    export const Wrapper = styled.section`
        position: relative;
        max-width: 700px;
        display: block;
        margin: 60px auto;
    `;

// Loading
    export const Loading = styled.section`
        display: block;
        width: auto;
        height: 64px;
        margin: 0 auto;
        text-align: center;
        padding-top: 80px;
        font-size: 30px;

        &:after{
            content: " ";
            display: block;
            width: 46px;
            height: 46px;
            border-radius: 50%;
            border: 5px solid #fff;
            border-color: #fff transparent #fff transparent;
            -webkit-animation: lds-dual-ring 1.2s linear infinite;
            animation: lds-dual-ring 1.2s linear infinite;
            left: 45%;
            position: absolute;
            top: 0px;
        }

        @keyframes lds-dual-ring {
            0% {
                transform: rotate(0deg);
            }
            100% {
                transform: rotate(360deg);
            }
        }
    `;

// Alert
    export const AlertUpdate = styled.div`
        text-align: center;
        background: #000;
        padding: 20px;
        font-size: 15px;

        strong{
            color: red;
        }

        i{
            color: Yellow;
        }
    `;

// Painel
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

// Log
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

// Footer
    export const Logo = styled.div`
        display: inline-block;
        width: 220px;
        margin-top: 15px;

        img{
            max-width: 100%;
        }
    `;

    export const Version = styled.div`
        float: right;
        margin-top: 20px;
    `;

    export const Copy = styled.div`
        background: rgba(255, 255, 255, 0.5);
        color: #222;
        position: absolute;
        padding: 10px 15px;
        border-radius: 4px 4px 0px 0px;
        bottom: 0px;
        left: 50%;
        font-size: 10px;
        transform: translateX( -50% );
        -webkit-transform: translateX( -50% );
        -moz-transform: translateX( -50% );
        -o-transform: translateX( -50% );
        -ms-transform: translateX( -50% );

        a{
            color: #222;
            &:hover{
                opacity: 0.6;
                transition-duration: 0.3s;
            }
        }
    `;