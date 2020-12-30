<script>
  import Modal from "../components/Modal/index";
  import Vue from "vue";
  import TableView from "../components/EntityTable/TableList";
  import { mapGetters } from "vuex";
  import { Logger } from '../main'
  import {MODAL_CREATE, MODAL_FILTER, MODAL_UPDATE} from "../consts";

  export default {
    components: {
      TableView,
      Modal
    },
    computed: {
      ...mapGetters([ 'getPageable' ]),
      pageable() {
        return this.getPageable(this.pageableName);
      },
      selectedItemName() {
        return this.selectedItem.name;
      },
      listedColumns() {
        return this.columns.filter(c => (!('listed' in c) || c.listed === true));
      },
    },
    data() {
      return {
        searchTags: [],
        selectedItem: {},
        showDeleteModal: false,
        showModal: false,
        form: null,
        searchForm: null,
        type: '',
        resErrors: {},
        loading: false,
        searchText: '',
        sort: {},
        filter: {},
      }
    },
    watch: {
      showModal() {
        if (this.showModal) {
          // подгружаем данные для динамических выпадающих списков
          this.columns.filter(c => c.selectList).forEach(c => c.selectMethod(''));
        }
      }
    },
    methods: {
      getAll() {
        this.search({
          params: {
            search: this.filter,
            sort: this.sort,
            page: this.page
          },
        });
      },
      handleExtSearch() {
        if (!this.searchForm) {
          this.form = {};
        } else {
          this.form = this.searchForm;
        }
        this.showModal = true;
        this.type = MODAL_FILTER;
      },
      handleDeleteSearchTag(tag) {
        this.searchTags = this.searchTags.filter(t => t.name !== tag.name);
        delete this.searchForm[tag.field];
        delete this.filter[tag.name];
        this.getAll();
      },
      handleEdit(index) {
        if (this.list[index]) {
          this.form = { ...this.list[index] };
          this.type = MODAL_UPDATE;
          this.showModal = true;
        }
      },
      handleDelete(index) {
        this.selectedItem = this.list[index];
        if (this.selectedItem) {
          this.loading = true;
          this.delete({ id: this.selectedItem.id }).then(() => {
            this.getAll();
          }).finally(() => {
            this.showDeleteModal = false;
            this.loading = false;
          }).catch(this.handleErrors);
        }
      },
      prepareCreateForm() {
        return {};
      },
      handleCreate() {
        this.form = this.prepareCreateForm();
        this.showModal = true;
        this.type = MODAL_CREATE;
      },
      onEntityFormClose() {
        this.showModal = false;
        this.form = null;
        this.resErrors = {};
      },
      onEntityFormSubmit() {
        const model = { ...this.form };
        if (this.type === MODAL_FILTER) {
          // форматированное представление
          let entityData = { ...this.form };
          for (const k in entityData) {
            if (k.startsWith('_')) {
              entityData[k.substr(1)] = entityData[k];
            }
          }
          this.searchForm = { ...this.form };
          this.filter = model;
          this.searchTags = [];
          for (let key in this.filter) {
            let colName;
            if (this.fields) {
              colName = this.fields.find(c => c.name === key || c.data === key).label;
            } else {
              colName = this.columns.find(c => c.name === key || c.data === key).label;
            }
            if (typeof (this.filter[key]) === 'object') {
              this.filter[key + '__id'] = this.filter[key].id;
              this.searchTags.push({ name: key + '__id', value: this.filter[key].name, label: colName, field: key });
              delete this.filter[key];
            } else {
              let value = '';
              let searchFormField = key;
              if (key.startsWith('_')) {
                value = entityData[key];
                this.filter[key.substr(1)] = this.filter[key];
                delete this.filter[key];
                key = key.substr(1);
              } else {
                value = this.filter[key];
              }
              this.searchTags.push({ name: key, value: value, label: colName, field: searchFormField });
            }
          }
          this.page = 0;
          this.getAll();
          this.onEntityFormClose();
        }
        if (this.type === MODAL_UPDATE) {
          this.edit(model).then(() => {
            this.getAll();
            this.onEntityFormClose();
          }).catch(this.handleErrors);
        } else if (this.type === MODAL_CREATE) {
          delete model.id;
          this.create(model).then(() => {
            // scroll entity table to top as new item will be the first one
            this.$el.querySelector('.el-table__body-wrapper').scrollTop = 0;
            this.getAll();
            this.onEntityFormClose();
          }).catch(this.handleErrors);
        }
      },
      sortChange({ prop, order }) {
        const orderTypes = {
          ascending: 'asc',
          descending: 'desc',
        };
        this.sort = { [prop]: orderTypes[order] };
        this.getAll();
      },
      searchChange(text) {
        this.searchText = text;
        this.getAll();
      },
      pagination(page) {
        this.page = page;
        this.getAll();
      },
      handleErrors({ errors, message }) {
        Logger.log('handleErrors', errors);
        if (!errors && message) {
          this.$alert(message.slice(0, 100));
          return;
        }
        (errors || []).forEach(error => {
          if (error.type === 'GLOBAL_ERROR') {
            this.$alert(error.message);
          } else {
            Vue.set(this.resErrors, error.field, error.message);
          }
        })
      },
      handleDeleteModalClose() {
        this.showDeleteModal = false;
      },
      handleConfirmedDelete(index) {
        this.selectedItem = this.list[index];
        this.showDeleteModal = true;
      },

      updateSelectData(query, searchMethod, field = 'name') {
        Logger.log('updateSelectData', searchMethod);
        this.loading = true;
        this.$store.dispatch(searchMethod, {
          params: {
            search: {
              [field]: query,
            },
            sort: {},
          },
        }).then(() => {
          this.loading = false;
        });
      },

    }

  }
</script>
