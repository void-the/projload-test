<template>
    <div>
        <table-list
                :list="list"
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
        A_CONTRACT_CREATE,
        A_CONTRACT_DELETE,
        A_CONTRACTS_SEARCH,
        A_CONTRACT_UPDATE, A_RP_USERS_SEARCH,
        GET_CONTRACTS, GET_RP_USERS
    } from "../../store/consts";
    import {mapActions, mapGetters} from "vuex";
    import {
        FIELD_CHECKBOX,
        FIELD_HIDDEN,
        FIELD_TEXT,
        MODAL_CREATE,
        MODAL_FILTER,
        MODAL_UPDATE,
        FIELD_SELECT,
        roleType,
        entityTypes
    } from "../../consts";

    export default {
        name: "Contracts",
        components: {EntityModal, TableList},
        mixins: [EntityFormMixins],
        data() {
            return {
                entityType: entityTypes.CONTRACTS,
                params: {
                    search: true,
                    actions: true,
                    deletable: true,
                    editable: true
                },
                columns: [
                    {label: 'ID', name: 'id', width: '100px'},
                    {label: 'Наименование', name: 'name'},
                    {label: 'Полное наименование', name: 'fullName'},
                    {label: 'Руководитель', name: 'userRp.fullName', width: '150px'},
                    {label: 'Активен', name: 'enabled', width: '100px'}
                ]
            }
        },
        computed: {
            ...mapGetters({
                list: GET_CONTRACTS,
                user: 'user',
                rpUsers: GET_RP_USERS
            }),
            fields() {
                if (this.type === MODAL_FILTER) {
                    return [
                        {label: 'Наименование', name: 'name', type: FIELD_TEXT, rules: ''},
                        {label: 'Полное наименование', name: 'fullName', type: FIELD_TEXT, rules: ''},
                        {
                            label: 'Руководитель',
                            name: 'userRpId',
                            type: FIELD_SELECT,
                            selectField: 'fullName',
                            selectValueField: 'id',
                            selectList: this.rpUsers
                        }
                    ]
                } else {
                    const fields = [
                        {name: 'id', type: FIELD_HIDDEN},
                        {label: 'Наименование', name: 'name', type: FIELD_TEXT, rules: ''},
                        {label: 'Полное наименование', name: 'fullName', type: FIELD_TEXT, rules: ''},
                        {label: 'Активен', name: 'enabled', type: FIELD_CHECKBOX, rules: ''},
                        {
                            label: 'Руководитель',
                            name: 'userRpId',
                            type: FIELD_SELECT,
                            selectField: 'fullName',
                            selectValueField: 'id',
                            selectList: this.rpUsers,
                            rules: 'required'
                        }
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
                search: A_CONTRACTS_SEARCH,
                create: A_CONTRACT_CREATE,
                update: A_CONTRACT_UPDATE,
                delete: A_CONTRACT_DELETE,
                rpSearch: A_RP_USERS_SEARCH
            }),
            getRpUsers() {
                this.rpSearch()
            },
            handleEdit(index) {
                const contractData = this.list[index];
                if (contractData) {
                    this.type = MODAL_UPDATE;
                    this.form = {...this.list[index]};
                    this.showModal = true;
                }
            },
            handleCreate() {
                this.form = this.prepareCreateForm();
                this.form['enabled'] = true
                if (this.user.role.id === roleType.RP) this.form['userRpId'] = this.user.id
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
                    delete model.id
                    this.create(model).then(() => {
                        this.$el.querySelector('.el-table__body-wrapper').scrollTop = 0
                        this.getAll()
                        this.onEntityFormClose()
                    }).catch(this.handleErrors)
                }
                if (this.type === MODAL_UPDATE) {
                    this.update(model).then(() => {
                        // scroll entity table to top as new item will be the first one
                        this.$el.querySelector('.el-table__body-wrapper').scrollTop = 0;
                        this.getAll();
                        this.onEntityFormClose();
                    }).catch(this.handleErrors);
                }
            },
        },
        mounted() {
            if (this.user.role.id === roleType.RP) {
                this.searchForm = {}
                this.searchForm['userRpId'] = this.user.id
                this.filter = {...this.searchForm}
                const tag = {
                    name: 'userRpId',
                    value: this.user.id,
                    label: 'Руководитель',
                    field: this.user.id,
                    displayValue: this.user.fullName
                }
                this.searchTags.push(tag)
            }
            this.getAll()
            this.getRpUsers()
        }
    }
</script>

<style scoped>

</style>
