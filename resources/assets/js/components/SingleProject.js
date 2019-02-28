import axios from 'axios'
    import React, { Component } from 'react'
const btnCompleteStyle = { float: 'right !important' };
    class SingleProject extends Component {
      constructor (props) {
        super(props)
        this.state = {
          project: {},
          tasks: [],
          title: '',
          errors: []
        }
        this.handleMarkProjectAsCompleted = this.handleMarkProjectAsCompleted.bind(this)
        this.handleFieldChange = this.handleFieldChange.bind(this)
        this.handleAddNewTask = this.handleAddNewTask.bind(this)
        this.hasErrorFor = this.hasErrorFor.bind(this)
            this.renderErrorFor = this.renderErrorFor.bind(this)

        
      }
    handleFieldChange (event) {
        this.setState({
          title: event.target.value
        })
      }
  
      handleAddNewTask (event) {
        event.preventDefault()
  
        const task = {
          title: this.state.title,
          project_id: this.state.project.id
        }
  
        axios.post('/api/tasks', task)
          .then(response => {
            // clear form input
            this.setState({
              title: ''
            })
            // add new task to list of tasks
            this.setState(prevState => ({
              tasks: prevState.tasks.concat(response.data)
            }))
          })
          .catch(error => {
            this.setState({
              errors: error.response.data.errors
            })
          })
      }
  
      hasErrorFor (field) {
        return !!this.state.errors[field]
      }
  
      renderErrorFor (field) {
        if (this.hasErrorFor(field)) {
          return (
            <span className='invalid-feedback'>
              <strong>{this.state.errors[field][0]}</strong>
            </span>
          )
        }
      }

      handleMarkProjectAsCompleted () {
        const { history } = this.props
  
        axios.put(`/api/projects/${this.state.project.id}`)
          .then(response => history.push('/'))
      }

      componentDidMount () {
        const projectId = this.props.match.params.id

        axios.get(`/api/projects/${projectId}`).then(response => {
          this.setState({
            project: response.data,
            tasks: response.data.tasks
          })
        })
      } 
      
      handleMarkTaskAsCompleted (taskId) {
        axios.put(`/api/tasks/${taskId}`).then(response => {
          this.setState(prevState => ({
            tasks: prevState.tasks.filter(task => {
              return task.id !== taskId
            })
          }))
        })
      }

      render () {
        const { project, tasks } = this.state

        return (
          <div className='container py-4'>
            <div className='row justify-content-center'>
              <div className='col-md-8'>
                <div className='card-box'>
                  <h4 className='card-title'>{project.name}</h4>
                  <div className='card-block'>
                    <p>{project.description}</p>

                    <button className='btn btn-primary btn-xs'>
                      Mark as completed
                    </button>

                    <hr />
                    <div className="row m-b-30 col-xs-offset-3">
                    <h4 className=''>Add Task</h4>
                        <form onSubmit={this.handleAddNewTask}>
                            <div className='input-group col-md-8'>
                                <input
                                type='text'
                                name='title'
                                className={`m-b-20 form-control ${this.hasErrorFor('title') ? 'is-invalid' : ''}`}
                                placeholder='Task title'
                                value={this.state.title}
                                onChange={this.handleFieldChange}
                                />
                                <div className='input-group-append'>
                                <button className='btn btn-primary btn-sm btn-block'>Add</button>
                                </div>
                                {this.renderErrorFor('title')}
                            </div>
                        </form>
                    </div>
                    <ul className='list-group mt-3'>
                      {tasks.map(task => (
                        <li
                          className='list-group-item d-flex justify-content-between align-items-center'
                          key={task.id}
                        >
                          {task.title}

                        <button style={ btnCompleteStyle } className='btn btn-primary btn-xs btn-complete' onClick={this.handleMarkTaskAsCompleted.bind(this,task.id)}>
                        Mark as completed </button>
                        </li>
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

    export default SingleProject