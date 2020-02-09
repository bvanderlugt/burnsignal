import React, { Fragment, useState, useContext } from 'react'
import { Dropdown, DropdownToggle } from "reactstrap"
import { Col, Row } from "reactstrap"

import { createURL } from "../../constants/operatives"
import { PINK_PRIMARY } from "../../constants/palette.js"
import { store } from "../../state"

const QRCode = require('qrcode.react')

function Option(props) {
  const ENS = `${createURL(props.title)}.burnsignal.eth`
  let { state } = useContext(store)

  function Unauthenticated({ option }){
    return(
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">{props.title}</h5>
          <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={props.dismiss}>
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div className="modal-body">
          Vote <span id="pink">{option}</span> by sending any amount of ETH to <br/>
          <a href='https://etherscan.io'><span id="pink">{option}</span>.{ENS}</a>
          <div className="poll-qr">
            <QRCode value={props.address[option]} />
          </div>
          To ensure that you vote counts, please link your ethereum account
          to your BrightID account at  <a href="https://ethereum.brightid.org">ethereum.brightid.org</a>
        </div>
      </div>
     )
   }

  function AuthenticatedAndVerified({ option }){
    return(
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">{props.title}</h5>
          <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={props.dismiss}>
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div className="modal-body">
          How much ETH will you burn to cast your vote?
          <input label="Amount" placeholder="0.5 ETH"/>
        </div>
        <div class="modal-footer">
          <button type="button" className="btn btn-primary btn-verify" data-dismiss="modal">
            Vote {option}
          </button>
        </div>
      </div>
    )
  }

  function AuthenticatedAndUnverified(){
    return(
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Please verify your account</h5>
          <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={props.dismiss}>
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div className="modal-body">
          Before casting your vote, you should verify your Ethereum account using BrightId.
        </div>
        <div class="modal-footer">
          <button type="button" className="btn btn-primary btn-verify" data-dismiss="modal">
            Verify
          </button>
        </div>
      </div>
     )
  }

  return (
    <Fragment>
      <div className="modal fade" id="yes" tabIndex="-1" role="dialog" aria-hidden="true">
        <div className="modal-dialog" role="document">
          { state.auth && state.verified && (<AuthenticatedAndVerified option="yes" />) }
          { !state.auth && !state.verified && (< Unauthenticated option="yes"/>) }
          { state.auth && !state.verified && (<AuthenticatedAndUnverified />) }
        </div>
      </div>
      <div className="modal fade" id="no" tabIndex="-1" role="dialog" aria-hidden="true">
        <div className="modal-dialog" role="document">
          { state.auth && state.verified && (<AuthenticatedAndVerified option="no" />) }
          { !state.auth && !state.verified && (< Unauthenticated option="no"/>) }
          { state.auth && !state.verified && (<AuthenticatedAndUnverified />) }
        </div>
      </div>
    </Fragment>
  )
}

export default Option
