
    import axios from 'axios'
    import React, { Component } from 'react'
    import { Link } from 'react-router-dom'

    class ProjectsList extends Component {
      constructor () {
        super()
        this.state = {
          projects: []
        }
      }

      componentDidMount () {
        axios.get('/api/projects').then(response => {
          this.setState({
            projects: response.data
          })
        })
      }

      render () {
        const { projects } = this.state
        return (
          <div className='container py-4'>
            <div className='row justify-content-center'>
              <div className='col-md-8'>
                <div className='card-box'>
                  <h4 className='card-title'>All projects</h4>
                  <div className='card-block'>
                    <Link className='btn btn-primary btn-sm m-b-10' to='/create'>
                      Create new project
                    </Link>
                    <ul className='list-group list-group-flush'>
                      {projects.map(project => (
                        <Link
                          className='list-group-item list-group-item-action d-flex justify-content-between align-items-center'
                          to={`/${project.id}`}
                          key={project.id}
                        >
                          {project.name}
                          <span className='badge badge-primary badge-pill'>
                            {project.tasks_count}
                          </span>
                        </Link>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      }
    }

    export default ProjectsList