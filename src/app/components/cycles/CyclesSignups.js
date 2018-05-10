
import { Link } from 'react-router-dom'
import Moment                    from 'react-moment'
import PropTypes                 from 'prop-types'
import { Panel } from 'react-bootstrap'

// work in progress, don't use yet
export const CyclesStatus = ({ title, cycles }) => {
  return 
       <div>
          <h2>Sign up for coming rounds</h2>
          <Panel>
            <Panel.Heading>
              <Panel.Title>Upcoming Rounds Available...</Panel.Title>
            </Panel.Heading>
            <Panel.Body>
              <div className="row">
                { columns.map( col => <div className={col.className}>{col.name}</div> )
                }
              </div>
              { comingSignupCycles.map( (cycle,rowIdx) => { 
                  let cols = columns.map( (col,colIdx) => 
                    <div className={col.className} key={colIdx}>
                      { col.renderer 
                        && col.renderer({column:colIdx, row:rowIdx, id:cycle.id, value:cycle[col.dataIndex]}) 
                        || cycle[col.dataIndex] 
                      }
                    </div> 
                  )
                  return <div className="row" key={rowIdx}>{cols}</div>
                })
              }
            </Panel.Body>
          </Panel>
        </div>
}