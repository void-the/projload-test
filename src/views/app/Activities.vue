<template>
    <div>
        <table-list
                :list="getList"
                :pageable="pageable"
                :columns="listedColumns"
                :params="params"
                :search-tags="searchTags"
                @edit="handleEdit"
                @create="handleCreate"
                @delete="handleDelete"
                @sort="sortChange"
                @extSearch="handleExtSearch"
                @deleteSearchTag="handleDeleteSearchTag"
                @pagination="pagination">
            <template #enabled="{ value }">
                <i class="el-icon-close" v-if="!value"></i>
                <i class="el-icon-check" v-else></i>
            </template>
        </table-list>
        <entity-modal
                v-if="showModal && form"
                :form="form"
                :fields="fields"
                :type="type"
                :loading="loading"
                :res-errors="resErrors"
                @submit="onEntityFormSubmit"
                @close="onEntityFormClose">
        </entity-modal>
    </div>
</template>

<script>
    import TableList from "../../components/EntityTable/TableList";
    import EntityFormMixins from "../../mixins/EntityFormMixins";
    import EntityModal from "../../components/EntityTable/EntityModal";
    import {
        FIELD_DATE,
        FIELD_HIDDEN, FIELD_LABEL,
        FIELD_SELECT,
        FIELD_TEXT,
        MODAL_CREATE,
        MODAL_FILTER,
        MODAL_UPDATE,
        roleType
    } from "../../consts";
    import {
        A_ACTIVITIES_SEARCH, A_ACTIVITIES_SEARCH_CURRENT_USER,
        A_ACTIVITY_CREATE, A_ACTIVITY_DELETE,
        A_ACTIVITY_UPDATE, A_CONTRACTS_SEARCH, A_USERS_SEARCH,
        GET_ACTIVITIES, GET_CONTRACTS, GET_USERS
    } from "../../store/consts";
    import {mapActions, mapGetters} from "vuex";

    export default {
        name: "Activity",
        components: {EntityModal, TableList},
        mixins: [EntityFormMixins],
        data() {
            return {
                params: {
                    search: true,
                    actions: true,
                    deletable: true,
                    editable: true
                }
            }
        },
        computed: {
            ...mapGetters({
                list: GET_ACTIVITIES,
                user: 'user',
                contracts: GET_CONTRACTS,
                users: GET_USERS
            }),
            pageableName() {
                return this.user.role.id === roleType.DEVELOPER ? A_ACTIVITIES_SEARCH_CURRENT_USER : A_ACTIVITIES_SEARCH
            },
            columns() {
                const columns = [
                    {label: 'ID', name: 'id', width: '100px'},
                    {label: 'Дата', name: 'date'},
                    {label: 'Проект', name: 'contract.fullName'},
                    {label: 'Длительность', name: 'duration'}]
                if (this.user && this.user.role.id !== roleType.DEVELOPER)
                    columns.push({label: 'Пользователь', name: 'user.fullName'})
                return columns
            },
            getList() {
                let result = this.list
                result.map(el => el.contract = this.contracts.find(con => con.id === el.contractId))
                result.map(el => el.user = this.users.find(us => us.id === el.userId))
                result.map(el => el.date = el.dateOf.join('-'))
                return result
            },
            fields() {
                if (this.type === MODAL_FILTER) {
                    return [
                        {label: 'Дата', name: 'dateOf', type: FIELD_DATE, rules: ''},
                    ]
                } else {
                    const fields = [
                        {name: 'id', type: FIELD_HIDDEN},
                        {
                            label: 'Проект',
                            name: 'contractId',
                            type: FIELD_SELECT,
                            selectField: 'fullName',
                            selectValueField: 'id',
                            selectList: this.contracts,
                            rules: 'required'
                        },
                        {label: 'Дата', name: 'dateOf', type: FIELD_DATE, rules: 'required'},
                        {label: 'Длительность', name: 'duration', type: FIELD_TEXT, rules: 'required'},
                        {value: 'Задача', type: FIELD_LABEL},
                        {label: 'URL', name: 'url', type: FIELD_TEXT, rules: ''},
                        {label: 'Описание', name: 'desc', type: FIELD_TEXT, rules: ''}
                    ];
                    if (this.type !== MODAL_CREATE) {
                        return fields.filter(field => !field.onlyCreate);
                    }
                    return fields;
                }
            }
        },
        methods: {
            ...mapActions({
                search: A_ACTIVITIES_SEARCH,
                searchMe: A_ACTIVITIES_SEARCH_CURRENT_USER,
                create: A_ACTIVITY_CREATE,
                update: A_ACTIVITY_UPDATE,
                delete: A_ACTIVITY_DELETE,
                searchContracts: A_CONTRACTS_SEARCH,
                searchUsers: A_USERS_SEARCH
            }),
            handleEdit(index) {
                const contractData = this.list[index];
                if (contractData) {
                    this.type = MODAL_UPDATE;
                    this.form = {...this.list[index]};
                    this.form['dateOf'] = this.form['dateOf'].join('-')
                    if (this.form['task'] && this.form['task'].url) this.form['url'] = this.form['task'].url
                    if (this.form['task'] && this.form['task'].desc) this.form['desc'] = this.form['task'].desc
                    this.showModal = true;
                }
            },
            handleCreate() {
                this.form = this.prepareCreateForm();
                this.showModal = true;
                this.type = MODAL_CREATE;
            },
            onEntityFormSubmit() {
                const model = {...this.form};
                if (this.type === MODAL_FILTER) {
                    this.searchForm = {...this.form};
                    this.filter = model;
                    this.searchTags = [];
                    for (let key in this.filter) {
                        let colName;
                        if (this.fields) {
                            colName = this.fields.find(c => c.name === key || c.data === key).label;
                        } else {
                            colName = this.columns.find(c => c.name === key || c.data === key).label;
                        }
                        let value = this.filter[key];
                        const tag = {
                            name: key,
                            value: value,
                            label: colName,
                            field: key
                        }
                        if (colName === 'Руководитель') {
                            const selectRP = this.rpUsers.find(el => el.id === value)
                            tag.displayValue = selectRP ? selectRP.fullName : null
                        }
                        this.searchTags.push(tag);
                    }
                    this.page = 0;
                    this.getAll();
                    this.onEntityFormClose();
                }
                if (this.type === MODAL_CREATE) {
                    const request = {
                        contractId: model.contractId,
                        duration: model.duration,
                        dateOf: model.dateOf,
                        task: {
                            url: model.url,
                            desc: model.task
                        }
                    }
                    this.create(request).then(() => {
                        this.$el.querySelector('.el-table__body-wrapper').scrollTop = 0
                        this.getAll()
                        this.onEntityFormClose()
                    }).catch(this.handleErrors)
                }
                if (this.type === MODAL_UPDATE) {
                    const request = {
                        id: model.id,
                        contractId: model.contractId,
                        duration: model.duration,
                        dateOf: model.dateOf,
                        task: {
                            url: model.url,
                            desc: model.task
                        }
                    }
                    this.update(request).then(() => {
                        // scroll entity table to top as new item will be the first one
                        this.$el.querySelector('.el-table__body-wrapper').scrollTop = 0;
                        this.getAll();
                        this.onEntityFormClose();
                    }).catch(this.handleErrors);
                }
            },
            getContracts() {
                this.searchContracts({params: {}})
            },
            getUsers() {
                this.searchUsers({params: {}})
            },
            getAll() {
                const params = {
                    search: this.filter,
                    sort: this.sort,
                    page: this.page
                }
                if (this.user && this.user.role.id === roleType.DEVELOPER) {
                    this.searchMe({params})
                } else {
                    this.search({params})
                }
            },
        },
        mounted() {
            this.getContracts()
            this.getUsers()
            this.getAll()
        }
    }
</script>

<style scoped>

</style>
