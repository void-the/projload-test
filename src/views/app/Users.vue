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
    import EntityForm from "../../mixins/EntityFormMixins";
    import {mapActions, mapGetters} from 'vuex'
    import {
        A_USER_CREATE, A_USER_DELETE,
        A_USER_ROLE_LIST,
        A_USER_UPDATE,
        A_USERS_SEARCH,
        GET_USER_ROLE_LIST,
        GET_USERS
    } from "../../store/consts";
    import {
        FIELD_CHECKBOX,
        FIELD_HIDDEN,
        FIELD_PASSWORD,
        FIELD_SELECT, FIELD_SLIDER,
        FIELD_TEXT,
        MODAL_CREATE,
        MODAL_FILTER,
        MODAL_UPDATE,

    } from "../../consts";
    import EntityModal from "../../components/EntityTable/EntityModal";

    export default {
        name: "Users",
        components: {EntityModal, TableList},
        mixins: [EntityForm],
        data() {
            return {
                pageableName: A_USERS_SEARCH,
                params: {
                    search: true,
                    actions: true,
                    deletable: true,
                    editable: true
                },
                columns: [
                    {label: 'ID', name: 'id', width: '100px'},
                    {label: 'Логин/email', name: 'email', width: '250px'},
                    {label: 'ФИО', name: 'fullName'},
                    {label: 'Роль', name: 'role.name', width: '150px'},
                    {label: 'Ставка', name: 'rate', width: '100px'},
                    {label: 'Активен', name: 'enabled', width: '100px', sortableOff: true}
                ]
            }
        },
        computed: {
            ...mapGetters({
                list: GET_USERS,
                roles: GET_USER_ROLE_LIST
            }),
            fields() {
                if (this.type === MODAL_FILTER) {
                    return [
                        {label: 'Логин/email', name: 'email', type: FIELD_TEXT, rules: ''},
                        {label: 'ФИО', name: 'fullName', type: FIELD_TEXT, rules: ''},
                        {
                            label: 'Роль',
                            name: 'roleId',
                            type: FIELD_SELECT,
                            selectField: 'name',
                            selectValueField: 'id',
                            selectList: this.roles
                        },
                    ];
                } else {
                    const fields = [
                        {name: 'id', type: FIELD_HIDDEN},
                        {label: 'Логин/email', name: 'email', type: FIELD_TEXT, rules: '', onlyCreate: true},
                        {label: 'ФИО', name: 'fullName', type: FIELD_TEXT, rules: ''},
                        {
                            label: 'Пароль',
                            name: 'password',
                            type: FIELD_PASSWORD,
                            rules: 'required|password:@matchingPassword',
                            onlyCreate: true
                        },
                        {
                            label: 'Повторите пароль',
                            name: 'matchingPassword',
                            type: FIELD_PASSWORD,
                            rules: 'required',
                            onlyCreate: true
                        },
                        {
                            label: 'Роль',
                            name: 'roleId',
                            type: FIELD_SELECT,
                            selectField: 'name',
                            selectValueField: 'id',
                            selectList: this.roles,
                            rules: 'required'
                        },
                        {label: 'Активен', name: 'enabled', type: FIELD_CHECKBOX, rules: ''},
                        {label: 'Ставка', name: 'rate', type: FIELD_SLIDER, step: 0.05, min: 0, max: 1, rules: ''}
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
                search: A_USERS_SEARCH,
                create: A_USER_CREATE,
                getRoles: A_USER_ROLE_LIST,
                update: A_USER_UPDATE,
                delete: A_USER_DELETE
            }),
            handleEdit(index) {
                const userData = this.list[index];
                if (userData) {
                    this.type = MODAL_UPDATE;
                    this.form = {...this.list[index]};
                    this.showModal = true;
                }
            },
            handleCreate() {
                this.form = this.prepareCreateForm();
                this.form['enabled'] = true
                this.form['rate'] = 1
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
                        if (colName === 'Роль') {
                            const selectedRole = this.roles.find(org => org.id === value)
                            tag.displayValue = selectedRole ? selectedRole.name : null
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
                if (this.type === MODAL_UPDATE ) {
                    this.update(model).then(() => {
                        // scroll entity table to top as new item will be the first one
                        this.$el.querySelector('.el-table__body-wrapper').scrollTop = 0;
                        this.getAll();
                        this.onEntityFormClose();
                    }).catch(this.handleErrors);
                }
            },
        },
        created() {
            this.getAll()
            this.getRoles()
        }
    }
</script>

<style scoped>

</style>
