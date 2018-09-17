import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Grid } from 'react-bootstrap';
import Promise from 'bluebird';
const qs = require('querystring');
import RetinaImage from 'react-retina-image';
import eth2air from 'eth2air-core';
import ButtonPrimary from './../common/ButtonPrimary';
import { SpinnerOrError, Loader } from './../common/Spinner';
import { getNetworkNameById } from '../../utils';
import WithHistory from './../HistoryScreen/WithHistory';
import { claimTokens } from '../../actions/transfer';
import web3Service from './../../services/web3Service';
import { authenticate } from './../../services/AuthService';
import styles from './../ClaimScreen/styles';
import PoweredByEth2 from './../common/poweredByEth2';
import CompletedReceivedScreen from './../Transfer/CompletedReceivedScreen';
import { ButtonLoader } from './../common/Spinner';
import GoogleLogin from 'react-google-login';


class ClaimScreen extends Component {
    constructor(props) {
        super(props);

        // parse URL params
        const queryParams = qs.parse(props.location.search.substring(1));
        const { c: contractAddress, ref: referralAddress } = queryParams;

        this.state = {
            contractAddress,
	    referralAddress,	    
            loading: true,
            errorMessage: "",
            fetching: false,
            tokenSymbol: null,
            amount: null,
            tokenAddress: null,
            imageExists: true
        };
    }

    componentDidMount() {
        this._getAirdropParams();
    }

    async _getAirdropParams() {
        try {
            const web3 = web3Service.getWeb3();

            // get airdrop params from the airdrop smart-contract
            const {
                tokenSymbol,
                claimAmount,
                tokenAddress
            } = await eth2air.getAirdropParams({
                contractAddress: this.state.contractAddress,
                transitPK: this.state.transitPK,
                web3
            });
	    
            // update UI
            this.setState({
                tokenSymbol,
                amount: claimAmount,
                tokenAddress,
                loading: false
            });
	    
        } catch (err) {
            console.log(err);
            alert("Couldn't get airdrop details. Error details in the console.");
        }
    }


    async onGoogleResponse(response) {
	console.log({response, state: this.state});
	
	try { 
	    const authResult = await authenticate({
		googleTokenId: response.tokenId,
		referralAddress: this.state.referralAddress,
		contractAddress: this.state.contractAddress	    
	    });
	    console.log({authResult});
	    if (authResult.success && authResult.link) {
		window.location.href = authResult.link;
	    }
	    
	} catch(err) {
	    console.log(err)
	    alert("Error while authenticating");
	}
    }

    
    _renderConfirmDetailsForm() {
        // wait until loaded
        if (this.state.loading) {
            return (<Loader text="Getting airdrop details..." textLeftMarginOffset={-50}/>);
        }

        return (
            <div style={{ flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ height: 250 }}>
                    <RetinaImage className="img-responsive" style={{...styles.tokenIcon, borderRadius: 50, WebkitBoxShadow: '0px 0px 20px rgba(0, 0, 0, 0.1)'}} src={this.state.imageExists ? `https://trustwalletapp.com/images/tokens/${this.state.tokenAddress}.png` : 'https://raw.githubusercontent.com/Eth2io/eth2-assets/master/images/default_token.png'} onError={(e) => {this.setState({imageExists: false})}}/>

                    <div style={styles.amountContainer}>
                        <span style={styles.amountNumber}>{this.state.amount} </span><span style={styles.amountSymbol}>{this.state.tokenSymbol}</span>
                    </div>
                    <div style={styles.formContainer}>
                        <div style={styles.button}>

			     <GoogleLogin
			     clientId="954902551746-leebjqk6hs426eivvvvbicr1adntat9s.apps.googleusercontent.com"
			     buttonText="Login"
				onSuccess={this.onGoogleResponse.bind(this)}
				onFailure={this.onGoogleResponse.bind(this)}
			       />
	    
                        </div>
                <div style={{ textAlign: 'center', marginTop: 20 }}>
	    
	    </div>
                <SpinnerOrError fetching={false} error={this.state.errorMessage} />		
            </div>		
            </div>
	    </div>
        );
    }

    render() {
        return (
	    <div>
              <Grid>
                <Row>
                  <Col sm={4} smOffset={4}>
                    <div>
                      {this._renderConfirmDetailsForm()}
                    </div>
                  </Col>
                </Row>
              </Grid>
	      <PoweredByEth2/>					
	    </div>
        );
    }
}


export default connect(state => ({ networkId: state.web3Data.networkId, claimAddress: state.web3Data.address }), { claimTokens })(ClaimScreen);
