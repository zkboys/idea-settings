import React from 'react';
import assign from 'object-assign';
import QueryTerms from '../../component/query-terms/QueryTerms';
import PaginationComponent from '../../component/pagination/PaginationComponent';
import Page from '../../framework/page/Page';
import BaseComponent from '../../component/BaseComponent';
import {Table} from 'antd';
#set( $h = '')
#set( $hs = $heads.split(' '))
#set( $headsLength = $hs.length)
#set($foreach='')  

class ${NAME} extends BaseComponent {
    state = {
        queryData: {
            currentPage: 1,
            pageSize: 10,
        },
        totalCount: 0,
        tableData: [],
    };

    queryTermsOptions = {
        showSearchBtn: true,
        resultDateToString: true,
        onSubmit: (data) => {
            let queryData = assign({}, this.state.queryData, data, {currentPage: 1});
            this.setState({
                queryData，
            });
            this.handleSearch(queryData);
        },
        items: [
            {
                type: 'tabsCard',
                name: 'status',
                defaultValue: '1',
                searchOnChange: true,
                options: [
                    {value: '1', label: 'TAB1'},
                    {value: '2', label: 'TAB2'},
                ]
            },
            [
                {
                    type: 'select',
                    name: 'store',
                    label: '下拉',
                    labelWidth: '50px',
                    fieldWidth: '200px',
                    // url: '/api/m/1/stores.json', // FIXME mch id
                    // optionsFilter(res){
                    //    return res.body.results.map((v)=>({value: v.id, label: v.name}))
                    // },
                    defaultValue: 'all',
                    searchOnChange: true,
                    options: [
                        {value: 'all', label: '全部'},
                        {value: '0', label: '选项0'},
                        {value: '1', label: '选项1'},
                    ],
                },
                {
                    type: 'input',
                    name: 'mobile',
                    label: '电话',
                    labelWidth: '50px'
                },
            ]
        ]
    };
    // FIXME columns的dataIndex 要替换成真实数据
    columns = [
        #foreach( $h in $hs)
        #if($h!='')
        {
            title: '$h',
            dataIndex: 'name$foreach.count',
            key: '$foreach.count',
        },
        #end
        #end
        {
            title: '操作',
            key: 'operator',
            render: (text, record) => {
                return (
                    <span>
                        <a href="javascript:void(0);" onClick={() =>this.handleEdit(record)}>编辑</a>
                        <span className="ant-divider"/>
                        <a href="javascript:void(0);" onClick={() =>this.handleDelete(record)}>删除</a>
                    </span>
                );
            }
        }
    ];

    componentDidMount() {
        this.handleSearch(this.state.queryData);
    };

    handleSearch = (queryData) => {
        const currentPage = queryData.currentPage;
        const pageSize = queryData.pageSize;
        queryData.size = queryData.pageSize;
        queryData.offset = (queryData.currentPage - 1) * queryData.pageSize;
        console.log(queryData);
        this.request()
            .get('/stores.json') // FIXME 这里要改成真实请求url
            .success((data, res) => {
                console.log(data);
                /*
                let tableData = data.results.map((v, i, a) => {
                    !v.key && (v.key = i);// 添加react需要的key
                    return v;
                });
                */
                let tableData = [];
                
                // FIXME 这里要替换成真是数据
                for (let i = 0; i < pageSize; i++) {
                    tableData.push({
                        key: i,
                        #foreach( $h in $hs)
                        #if($h!='')
                        name$foreach.count: '$h' + currentPage + '--' + i,
                        #end
                        #end
                    });
                }
                const totalCount = 117;

                this.setState({
                    queryData,
                    tableData,
                    totalCount,
                })
            })
            .end();
    };
    handleEdit = (record) => {
        console.log('edit', record);
    };
    handleDelete = (record) => {
        console.log('delete', record);
    };

    render() {
        const data = this.state.tableData;
        const paginationOptions = {
            showSizeChanger: true,
            showQuickJumper: true,
            showMessage: true,
            pageSize: this.state.queryData.pageSize,
            currentPage: this.state.queryData.currentPage,
            totalCount: this.state.totalCount,
            onChange: (currentPage, pageSize) => {
                let queryData = assign({}, this.state.queryData, {currentPage, pageSize});
                this.setState({
                    queryData
                });
                this.handleSearch(queryData);
            }
        };

        return (
            <Page header='auto' loading={this.state.loading}>
                <QueryTerms options={this.queryTermsOptions}/>
                <Table
                    columns={this.columns}
                    dataSource={data}
                    pagination={false}
                />
                <PaginationComponent options={paginationOptions}/>
            </Page>
        )
    };
}
export default ${NAME};
