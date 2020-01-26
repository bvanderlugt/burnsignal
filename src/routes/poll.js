import React, { Fragment, useState, useEffect } from 'react';
import { Row, Col } from "reactstrap";

import { getVoteInfo, getQuadraticTotals } from '../constants/operatives'
import { getProposalData } from "../constants/calls/GraphQL"
import { getTransactions } from "../constants/calls/REST"
import { chartId } from "../constants/operatives"

import Spline from '../assets/components/charts/spline'
import Bar from '../assets/components/charts/bar'

import "../assets/css/proposal.css"

function Poll(props){
  const [ pollRecords, setRecords ] = useState({ yes: [], no: [] })
  const [ pollCount, setCount ] = useState({ yes: [], no: [] })
  const [ graphState, setGraphState ] = useState(false)
  const [ uniqueAddresses, setUnique ] = useState(0)
  const [ totalPledged, setPledged ] = useState(0)
  const [ pollTopic , setTopic ] = useState("")

  useEffect(() => {
    const getMetadata = async() => {
      let { name, optionAaddr, optionBaddr } = props.proposal;

      var proposalData = await getProposalData(name);
      var voteInfo = await getVoteInfo(proposalData);
      var quadraticInfo = await getQuadraticTotals(voteInfo.voters);
      var noVotes = await getTransactions(optionBaddr, false);
      var yesVotes = await getTransactions(optionAaddr, true);

      let { noCount, yesCount, uniqueAddresses, totalValue } = quadraticInfo;

      setRecords({ yes: yesVotes, no: noVotes })
      setCount({ yes: yesCount, no: noCount })
      setUnique(uniqueAddresses)
      setPledged(totalValue)
      setGraphState(true)
      setTopic(name)
    }
    getMetadata()
  }, [ props ])

  return(
     <div className="proposalComponent">
      <Row>
        <Col sm="12" md={{ size: 8, offset: 2 }}>
          <div className="card">
            <div className="card-header">
              <div className="proposal-title">{pollTopic}</div>
            </div>
            <div className="card-body">
              <div className="github-detail">See GitHub for full details:</div>
              <div className="vote-options">
                <button className="btn btn-primary btn-simple">Yes</button>
                <button className="btn btn-primary btn-simple">No</button>
              </div>
            </div>
          </div>
        </Col>
      </Row>
      <Row>
        <Col sm="12" md={{ size: 8, offset: 2 }}>
          <div className="card">
            <div class="card-header">
              <h3 class="card-category">Results</h3>
            </div>
            <div className="card-body">
              {graphState && (
                <Bar
                  chartId={chartId(props.proposal.id)}
                  yesCount={pollCount.yes}
                  noCount={pollCount.no}/>
              )}
            </div>
          </div>
        </Col>
      </Row>
      <Row>
        <Col sm="12" md={{ size: 8, offset: 2 }}>
          <div className="card">
            <div class="card-header">
              <h3 class="card-category">History</h3>
            </div>
            <div class="card-body">
              {graphState && (
                <Spline
                  chartId={chartId(props.proposal.id)}
                  yesVotes={pollRecords.yes}
                  noVotes={pollRecords.no}
                />
              )}
            </div>
          </div>
        </Col>
      </Row>
     </div>
  )
}

export default Poll
