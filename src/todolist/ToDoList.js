import React, { Component } from 'react';
import { getAllToDoLists, createToDoList, deleteToDoList } from '../util/APIUtils';
import './ToDoList.css';
import ReactTable from "react-table";
import "react-table/react-table.css";
import LoadingIndicator from '../common/LoadingIndicator';
import { Layout,Form, Input, Button, notification } from 'antd';
import {Link} from 'react-router-dom'

const FormItem = Form.Item;
const { Content} = Layout;



class ToDoList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            toDoLists: [],
            isLoading : false,
            name: ''
        };
        this.loadToDoLists = this.loadToDoLists.bind(this);
        this.createTable = this.createTable.bind(this);
        this.handleAddToDoList = this.handleAddToDoList.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleDeleteToDoList = this.handleDeleteToDoList.bind(this);
    }
    componentDidMount() {
        this.loadToDoLists();
    }
    loadToDoLists(){
        this.setState({
            isLoading: true
          });
        let promise;
        promise = getAllToDoLists();

        if(!promise) {
            return;
        }
        promise            
        .then(response => {
            this.setState({
                toDoLists: response,
                isLoading : false
            })
        }).catch(error => {
            this.setState({
                isLoading : false
            })
        });
    }
    createTable(toDoLists){
        let data;
        if(toDoLists === null || toDoLists.length === 0){
            data = [];
        }else{
        data = toDoLists.map(toDoList =>
            {
                return {
                name: toDoList.name,
                actions: <div><center>
                    <Button type="primary"><Link to={{ pathname: '/todoitem', state: { toDoListId: toDoList.id, toDoListName: toDoList.name} }}>See To-Do Items</Link></Button>
                    <Button type="danger" onClick={() => this.handleDeleteToDoList(toDoList.id)}>Delete To-Do List</Button>
                    </center></div>
                }
            }
            );
        }
        return <div><ReactTable
        data={data}
        filterable
        defaultFilterMethod={(filter, row) =>
            String(row[filter.id]) === filter.value}
        columns={[
          {
            columns: [{
                Header: "Name",
                accessor: "name",
                Filter: ({filter, onChange}) => (
                    <input type='text'
                           placeholder="Search with Name"
                           value={filter ? filter.value : ''}
                           onChange={event => onChange(event.target.value)}
                           className="react-table"
                    />
                  ),
                filterMethod: (filter, row) =>
                row[filter.id].startsWith(filter.value) 
              },
              {
                  Header: "Actions",
                  accessor: "actions",
                  filterable: false,
                  sortable: false
              }
            ]
          }
        ]}
          defaultPageSize={10}
          className="-striped -highlight"
        /></div>;
    }
    handleAddToDoList(event){
    
        event.preventDefault();
        const createRequest = {
            name: this.state.name.value
        };
        createToDoList(createRequest)
        .then(response => {
            notification.success({
                message: 'To-Do App',
                description: "You're successfully added new To-Do List.",
            });
            this.loadToDoLists();
        }).catch(error => {
            notification.error({
                message: 'To-Do App',
                description: 'Sorry! Something went wrong. Please try again!'
            });
        });
    }

    handleDeleteToDoList(id){
        
        deleteToDoList(id)
        .then(response => {
            notification.success({
                message: 'To-Do App',
                description: response.message,
            });
            this.loadToDoLists();
        }).catch(error => {
            notification.error({
                message: 'To-Do App',
                description:  'Sorry! Something went wrong. Please try again!'
            });
        });
    }

    
    handleInputChange(event, validationFun) {
        const target = event.target;
        const inputName = target.name;        
        const inputValue = target.value;

        this.setState({
            [inputName] : {
                value: inputValue,
                ...validationFun(inputValue)
            }
        });
    }

    validateName = (name) => {
        if(name.length < 3) {
            return {
                validateStatus: 'error',
                errorMsg: `Name is too short (Minimum 3 characters needed.)`
            }
        } else if (name.length > 64) {
            return {
                validationStatus: 'error',
                errorMsg: `Name is too long (Maximum 64 characters allowed.)`
            }
        } else {
            return {
                validateStatus: 'success',
                errorMsg: null,
              };            
        }
    }
    render() {
        if(this.state.isLoading) {
            return <LoadingIndicator />
          }
        let table = this.createTable(this.state.toDoLists);
        
        return(
        <Layout>
            <h1 className="page-title">To-Do List</h1>
            <Layout>
            <Content>
                <Form layout="inline" onSubmit={this.handleAddToDoList}>
                        <FormItem 
                            label="List Name"
                            validateStatus={this.state.name.validateStatus}
                            help={this.state.name.errorMsg}>
                            <Input 
                                size="large"
                                name="name"
                                autoComplete="off"
                                placeholder="To-Do List Name"
                                value={this.state.name.value} 
                                onChange={(event) => this.handleInputChange(event, this.validateName)} />    
                        </FormItem>
                        <FormItem>
                            <Button type="primary"
                                size="large" 
                                htmlType="submit"
                                disabled={!(this.state.name.validateStatus === 'success')}>Add ToDo List</Button>
                        </FormItem>
                        </Form>
                        </Content>
            </Layout>
            <br/>
            <Layout>
                <Content>
                    <div id="divTable">{table}</div>
                </Content>
            </Layout>
       </Layout>
    );
    }
}

export default (ToDoList);