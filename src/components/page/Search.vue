<template>
    <div class="app-container">

        <!-- 搜索条件 -->
        <div class="filter-container">
            <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="明星、导演姓名" v-model="listQuery.name">
            </el-input>

            <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="电影类型" v-model="listQuery.type">
            </el-input>

            <!-- <el-select clearable class="filter-item" style="width: 130px" v-model="listQuery.type" placeholder="类型">
              <el-option v-for="item in  typeOptions" :key="item.key" :label="item.display_name+'('+item.key+')'" :value="item.key">
              </el-option>
            </el-select> -->

            <el-button class="filter-item" type="primary"  icon="search" @click="handleFilter">搜索</el-button>
            <!--&lt;!&ndash; <el-button class="filter-item" type="primary" @click="handleCreate"  icon="edit">添加</el-button>-->

            <!--<el-button class="filter-item" type="primary" @click="handleDelAll"  icon="edit">批量删除</el-button>-->
            <!--<el-button class="filter-item" type="primary" icon="document" @click="handleDownload">导出</el-button> &ndash;&gt;-->

        </div>



        <!-- 表格 v-loading.body="listLoading"-->
        <el-table ref="multipleTable" @selection-change="handleSelectionChange" :data="list"  element-loading-text="拼命加载中" border fit highlight-current-row  >
            <el-table-column type="selection" width="50">
            </el-table-column>

            <el-table-column align="center" label='序号' width="70" >
                <template slot-scope="scope">
                    {{ scope.$index+1 }}
                </template>
            </el-table-column>

            <el-table-column label="海报" width="" align="center">
                <template slot-scope="scope">
                    <a :href="scope.row.alt" class="" style="margin: 10px 0;display: inline-block;">
                        <img :src="scope.row.images.small" alt="" style="vertical-align: middle;max-width: 100%;">
                    </a>

                </template>
            </el-table-column>

            <el-table-column label="名称" width="" prop="title" sortable>
                <template slot-scope="scope">

                    {{ scope.row.title }}
                </template>
            </el-table-column>

            <el-table-column label="主演" width="">
                <template slot-scope="scope" >
                    <template class="" v-for="item in scope.row.casts">
                        <p><a :href="item.alt">&nbsp;{{ item.name }}&nbsp;</a>、</p>
                    </template>

                </template>
            </el-table-column>


            <el-table-column label="类型" width="">
                <template slot-scope="scope">
                    <span>{{scope.row.genres}}</span>
                </template>
            </el-table-column>

            <el-table-column label="综合评分"  align="center" width=""  prop="rating.average" sortable >
                <template slot-scope="scope">
                    {{scope.row.rating.average}}
                </template>
            </el-table-column>

            <el-table-column align="center" prop="created_at" label="收藏量" width=""   >
                <template slot-scope="scope">

                    <span>{{scope.row.collect_count}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center"  label="上映年份" prop="year" sortable >
                <template slot-scope="scope">
                    <!-- <i class="el-icon-time"></i> -->
                    <span>{{scope.row.year}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center"  label="操作" >
                <template slot-scope="scope">

                    <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>

                </template>
            </el-table-column>
        </el-table>
        <!-- 分页 -->
        <div v-show="!listLoading" class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.currPage"
                           :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>


    </div>
</template>

<script>

    export default {
        data() {
            return {
                // list: null,
                // listLoading: true,

                list: null,//表格list
                total: null,
                listLoading: true,
                listQuery: {
                    currPage: 1,
                    pageSize: 10,
                    // importance: undefined,
                    name: '',
                    type: null,//类型
                },
                multipleSelection: []

            }
        },
        mounted() {
            var vm = this;

            // vm.getList();



        },
        methods: {
            //获取列表数据
            getList() {
                var vm = this;
                vm.listLoading = true;
                //请求参数
                let par = {
                    "count": vm.listQuery.pageSize,
                    "start": (vm.listQuery.currPage-1)*vm.listQuery.pageSize,
                    "q": vm.listQuery.name,         //明星、导演姓名
                    "tag": vm.listQuery.type,       //类型
                };
                // jsonp请求方式
                vm.$http.jsonp('https://api.douban.com/v2/movie/search',{params: par}).then(res => {
                    console.log(res)
                    // success callback
                    var data = res.body;
                    console.log(data)
                    if(data.subjects){
                        vm.list = data.subjects;
                        console.log('列表数据：',vm.list);
                        // vm.listQuery.currPage = data.start + 1; //页数开始
                        // vm.listQuery.pageSize = data.count;     //每页多少条
                        vm.total = data.total;
                        vm.listLoading = false;
                    }else{
                        //alert(res.body.resultMsg)
                        Message({
                            showClose: true,
                            message: res.body.resultMsg,
                            type: 'error'
                        });
                        vm.listLoading = false;
                    }
                }, res => {
                    // error callback
                    console.log(res)

                    vm.listLoading = false;
                });




            },
            //编辑
            handleEdit(index,row){
                var vm = this;
                console.log('编辑的row：',index,'-----',row);
                //跳页面进行修改
                //this.$router.push('/example/form');
                this.$router.push( { path: '/example/form', query: { id: row.chnlId } } ); //带参跳转
            },
            //单个删除
            handleDelete(index,row){
                var vm = this;
                console.log('单个删除选择的row：',index,'-----',row);
                //前端删除。
                vm.list.splice(index,1)
            },
            //批量删除
            handleDelAll(){
                var vm = this;
                console.log('批量删除选择的row：',vm.multipleSelection)
            },
            //搜索
            handleFilter() {
                this.getList();
            },
            //操作分页
            handleSizeChange(val) {
                console.log('--------一页多少条：',val)
                this.listQuery.pageSize = val;
                this.getList();
            },
            //操作分页
            handleCurrentChange(val) {
                console.log('--------当前页：',val)
                this.listQuery.currPage = val;
                this.getList();
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },


        }
    };
</script>
