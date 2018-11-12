import React, { Component } from 'react';
import { getAllToDoItems, createToDoItem, deleteToDoItem,createDependency, completeToDoItem } from '../util/APIUtils';
import ReactTable from "react-table";
import "react-table/react-table.css";
import LoadingIndicator from '../common/LoadingIndicator';
import { Collapse, Layout,Form, Input, Button, notification, DatePicker,Select  } from 'antd';
const FormItem = Form.Item;
const {Content} = Layout;
const Option = Select.Option;
const Panel = Collapse.Panel;

class ToDoItem extends Component {
    constructor(props) {
        super(props);
        const {toDoListId, toDoListName} = props.location.state;
        this.state = {
            ToDoItems: [],
            isLoading : false,
            name: '',
            deadline: '',
            toDoListName:toDoListName,
            toDoListId: toDoListId,
            selectedItem: '',
            selectedDependency: ''
        };
        this.loadToDoItems = this.loadToDoItems.bind(this);
        this.createTable = this.createTable.bind(this);
        this.handleAddToDoItem = this.handleAddToDoItem.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleDeleteToDoItem = this.handleDeleteToDoItem.bind(this);
        this.onDateTimeChange = this.onDateTimeChange.bind(this);
        this.handleAddDependency = this.handleAddDependency.bind(this);
        this.loadDependencyForm = this.loadDependencyForm.bind(this);
        this.handleSelectedItem = this.handleSelectedItem.bind(this);
        this.handleSelectedDependency = this.handleSelectedDependency.bind(this);
    }
    componentDidMount() {
        this.loadToDoItems();
    }

    onDateTimeChange(date, dateString){
        
        this.setState({
            deadline: dateString
        });
    }
    loadToDoItems(){
        this.setState({
            isLoading: true
          });
        let promise;
        promise = getAllToDoItems(this.state.toDoListId);

        if(!promise) {
            return;
        }
        promise            
        .then(response => {
            this.setState({
                ToDoItems: response,
                isLoading : false
            })
        }).catch(error => {
            this.setState({
                isLoading : false
            })
        });
    }
    createTable(ToDoItems){
        let data;
        if(ToDoItems === null || ToDoItems.length === 0){
            data = [];
        }else{
        data = ToDoItems.map(toDoItem =>
            {
                return {
                    todoid: toDoItem.id,
                    name: toDoItem.name,
                    actions: <div><center>
                        <Button type="primary" onClick={() => this.handleCompleteToDoItem(toDoItem.id)}>Complete</Button>
                        <Button type="danger" onClick={() => this.handleDeleteToDoItem(toDoItem.id)}>Delete</Button>
                        </center></div>,
                    deadline: toDoItem.deadline,
                    status: toDoItem.status,
                    children: toDoItem.dependencies.map(child =>
                        {
                            return {
                                todoid: toDoItem.id,
                                name: child.name,
                                actions: <div><center>
                                    child
                                    </center></div>,
                                deadline: child.deadline,
                                status: child.status
                            }
                        })
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
                Header: "Deadline",
                accessor: "deadline",
                Filter: ({filter, onChange}) => (
                    <input type='text'
                           placeholder="Search with Datetime"
                           value={filter ? filter.value : ''}
                           onChange={event => onChange(event.target.value)}
                           className="react-table"
                    />
                  )  
            },
            {
                Header:"Status",
                accessor: "status",
                Filter: ({filter, onChange}) => (
                    <input type='text'
                           placeholder="Search with Satus"
                           value={filter ? filter.value : ''}
                           onChange={event => onChange(event.target.value)}
                           className="react-table"
                    />
                  )
            },
            {
                Header: "Actions",
                accessor: "actions",
                filterable: false,
                sortable: false
            }
            
          ]}
          SubComponent={(row) => { 
          return <div style={{ padding: "20px" }}>
          <h4>
          To-Do Item Dependencies
                </h4>
          <ReactTable
          data={row.original.children}
          filterable
          defaultFilterMethod={(filter, row) =>
              String(row[filter.id]) === filter.value}
          columns={[
              {
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
                  Header: "Deadline",
                  accessor: "deadline",
                  Filter: ({filter, onChange}) => (
                      <input type='text'
                             placeholder="Search with Datetime"
                             value={filter ? filter.value : ''}
                             onChange={event => onChange(event.target.value)}
                             className="react-table"
                      />
                    )  
              },
              {
                  Header:"Status",
                  accessor: "status",
                  Filter: ({filter, onChange}) => (
                      <input type='text'
                             placeholder="Search with Satus"
                             value={filter ? filter.value : ''}
                             onChange={event => onChange(event.target.value)}
                             className="react-table"
                      />
                    )
              }
              
            ]}
            defaultPageSize={3}
            className="-striped -highlight"
          /></div>; }}
          defaultPageSize={10}
          className="-striped -highlight"
        /></div>;
    }
    handleAddToDoItem(event){
    
        event.preventDefault();
        const createRequest = {
            name: this.state.name.value,
            deadline: this.state.deadline,
            toDoListId: this.state.toDoListId
        };
        
        createToDoItem(createRequest)
        .then(response => {
            notification.success({
                message: 'To-Do App',
                description: "You're successfully added new To-Do List.",
            });
            this.setState ( {
                ToDoItems: [],
                name: '',
                deadline: ''
            });
            this.loadToDoItems();
        }).catch(error => {
            notification.error({
                message: 'To-Do App',
                description: 'Sorry! Something went wrong. Please try again!'
            });
        });
    }

    handleAddDependency(event){
    
        
        event.preventDefault();
        const createRequest = {
            toDoItemId: this.state.selectedItem,
            dependencyId: this.state.selectedDependency
        };
        
        createDependency(createRequest)
        .then(response => {
            notification.success({
                message: 'To-Do App',
                description: "You're successfully added new Dependency.",
            });
            this.setState ( {
                selectedItem:'',
                selectedDependency:''
            });
            this.loadToDoItems();
        }).catch(error => {
            notification.error({
                message: 'To-Do App',
                description: error.message
            });
        });
    }
    handleDeleteToDoItem(id){
        
        deleteToDoItem(id)
        .then(response => {
            notification.success({
                message: 'To-Do App',
                description: response.message,
            });
            this.loadToDoItems();
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
    handleCompleteToDoItem(id){
        
        completeToDoItem(id)
        .then(response => {
            notification.success({
                message: 'To-Do App',
                description: response.message,
            });
            this.loadToDoItems();
        }).catch(error => {
            
            notification.error({
                message: 'To-Do App',
                description:  error.message
            });
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
    handleSelectedItem(value){
        this.setState({
            selectedItem: value
        })
    }
    handleSelectedDependency(value){
        this.setState({
            selectedDependency: value
        })
    }
    loadDependencyForm(){
        let option = this.state.ToDoItems.map(item =>
            
                <Option key={item.id.toString()} value={item.id}>{item.name}</Option>
            );
        return <div>
            <Form layout="inline" onSubmit={this.handleAddDependency}>
                        <FormItem 
                            label="Item Name">
            <Select
            showSearch
            style={{ width: 200 }}
            placeholder="Select a item"
            optionFilterProp="children"
            onChange={this.handleSelectedItem}
            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
            { option
            }
        </Select>
        </FormItem>
        <FormItem label="Dependency Name">
        <Select
            showSearch
            style={{ width: 200 }}
            placeholder="Select a item"
            optionFilterProp="children"
            onChange={this.handleSelectedDependency}
            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
            { option
            }
        </Select>
        </FormItem>
        <FormItem>
            <Button type="primary"
                size="large" 
                htmlType="submit"
                disabled={!(this.state.selectedItem !== '' && this.state.selectedDependency !=='')}
                >Add Dependency</Button>
        </FormItem>
        </Form>
        </div>;
    }
    render() {
        if(this.state.isLoading) {
            return <LoadingIndicator />
          }
        let table = this.createTable(this.state.ToDoItems);
        let dependecyForm = this.loadDependencyForm();
        return(
        <Layout>
            <h1 className="page-title">{this.state.toDoListName} To-Do Items</h1>
            <Collapse bordered={false} defaultActiveKey={['1']}>
            <Panel header="Add To-Do Item" key="1">
                <Layout>
                    <Content>
                        <Form layout="inline" onSubmit={this.handleAddToDoItem}>
                            <FormItem 
                                label="Item Name"
                                validateStatus={this.state.name.validateStatus}
                                help={this.state.name.errorMsg}>
                                <Input 
                                    size="large"
                                    name="name"
                                    autoComplete="off"
                                    placeholder="To-Do Item Name"
                                    value={this.state.name.value} 
                                    onChange={(event) => this.handleInputChange(event, this.validateName)} />    
                            </FormItem>
                            <FormItem  label="Deadline"> 
                            <DatePicker size="large" onChange={this.onDateTimeChange} />   
                            </FormItem>
                            <FormItem>
                                <Button type="primary"
                                    size="large" 
                                    htmlType="submit"
                                    disabled={!(this.state.name.validateStatus === 'success' && this.state.deadline !=='')}>Add ToDo Item</Button>
                            </FormItem>
                        </Form>
                    </Content>
                </Layout>
            </Panel>
            <Panel header="Add To-Do Item Dependency" key="2">
                <Layout>
                    <Content>
                        {dependecyForm}
                    </Content>
                </Layout>
            </Panel>
            </Collapse>
            <br/>
            <Layout>
                <Content>
                    <div id="divTable">{table}</div>
                    <div style={{ textAlign: "center" }}>
                        <em>Tip: Hold shift when sorting to multi-sort!</em>
                    </div>
                </Content>
            </Layout>
       </Layout>
    );
    }
}

export default (ToDoItem);