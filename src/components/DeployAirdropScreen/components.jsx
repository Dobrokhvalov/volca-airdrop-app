import React, { Component } from 'react';
import { CSVLink, CSVDownload } from 'react-csv';
import { getEtherscanLink } from './../Transfer/components';
import { SpinnerOrError, Loader } from './../common/Spinner';
import styles from './styles';
import RetinaImage from 'react-retina-image';


export const DownloadLinksButton = ({ links }) => {

    if (links.length === 0) {
        return null;
    }

    return (
        <div> 3. Links generated:
	  <br />
            <div>
                <CSVLink data={links} filename="airdrop-links.csv" className="btn btn-primary">
                    3. Download Links (CSV)
	    </CSVLink>
            </div>
        </div>
    );
}


const StatusDetailsAndApproveButton = ({ txHash, networkId, contractAddress, onSubmit, disabled }) => {
    //if (!txHash) { return null; }
    let stepLabel = "Deploy Tx: ";
    if (!contractAddress) {
        disabled=true
    }
    let buttonColor;
    if (disabled) {
        buttonColor='#B2B2B2'
    }
    else {
        buttonColor='#0078FF'
    }
    const etherscanLink = getEtherscanLink({ txHash, networkId });
    return (
        <div>
            <div style={{ display: 'flex', fontSize: 26, marginTop: 80, marginBottom: 60 }}>
                <div style={{ fontFamily: 'Inter UI Regular', color: '#979797', marginRight: 10 }}>2/3</div>
                <div style={{ fontFamily: 'Inter UI Black', color: '#0099FF', }}>Approve smart contract</div>
            </div>
            <div style={{ ...styles.airdropBalanceContainer, width: 850, height: 238, display: 'block', flexDirection: 'column', padding: '40px 0px 40px 40px' }}>
                {!contractAddress ?
                    <div style={{height: 30, marginBottom: 25, display: 'flex', fontSize: 20, fontFamily: 'Inter UI Medium'}}>
                        <div style={{marginRight: 15}}>Creating Smart Contract</div>
                        <Loader _className='' text="" size="small" />
                        {/* <a href={etherscanLink} className="link" target="_blank">{txHash}</a> */}
                    </div>
                    : 
                    <div style={{height: 30, marginBottom: 25, display: 'flex', fontSize: 20, fontFamily: 'Inter UI Medium'}}>
                        <div style={{marginRight: 15}}>Smart Contract created</div>
                        <RetinaImage src={`https://raw.githubusercontent.com/Eth2io/eth2-assets/master/images/done_small.png`} style={{ display: 'inline', height:'fit-content'}} />                        
                    </div>
                    }
                    <div style={{marginBottom: 20, fontFamily: 'Inter UI Regular', fontSize: 18}}>Setup TX: <a href={etherscanLink} style={{color: '#0078FF', textDecoration: 'none'}} target="_blank">{txHash}</a></div>
                    <div style={{marginBottom: 30, fontFamily: 'Inter UI Regular', fontSize: 18}}>Smart Contract: {contractAddress ? <a href={etherscanLink} style={{color: '#0078FF', textDecoration: 'none'}} target="_blank">{contractAddress}</a> : <span style={{color: '#979797'}}>Transaction is processing</span>}</div>            
                    <div style={{fontFamily: 'Inter UI Regular', fontSize: 14, color: '#979797'}}>It may take a few minutes, don't close this page</div>
            </div>
            <div style={styles.button}>
                    <button
                        style={{width: 250, height: 45, margin: 40, borderWidth: 0, borderRadius: 5, backgroundColor: buttonColor, textAlign: 'center', fontFamily: 'Inter UI Medium', fontSize: 20, color: 'white'}}
                        onClick={onSubmit}
                        disabled={disabled}
                    >
                        Approve
	      </button>
                </div>
        </div>
    );
}


// const ContractDetails = ({ contractAddress, networkId, disabled, onSubmit }) => {
//     if (!contractAddress) { return null; }
//     const etherscanLink = getEtherscanLink({ address: contractAddress, networkId });

//     return (
//         <div>
//             <div> Airdrop Contract created at: <a href={etherscanLink} className="link" target="_blank">{contractAddress}</a> </div>

//             <div style={{ marginTop: 50 }}>
                
//             </div>
//             <hr />
//         </div>
//     );
// }


export const ContractDetails = ({ contractAddress, networkId, disabled, onSubmit, txHash, links }) => (
    <div>
        {links.length > 0 && contractAddress ? 
        <DownloadLinksButton links={links}/> :
        <StatusDetailsAndApproveButton txHash={txHash} networkId={networkId} contractAddress={contractAddress} onSubmit={onSubmit} disabled={disabled}/>}
    </div>
);
