<template>
  <div>
    <el-row>
      <el-col v-if="params.search" :span="13">
        <div @click="handleExtSearch" class="el-card" style="padding: 3px">
          <el-tag style="margin-right: 4px;"
                  v-for="tag in searchTags"
                  :key="tag.name"
                  @close="deleteSearchTag(tag)"
                  closable
          >
            {{ tag.label }}: {{ tag.displayValue || tag.value }}
          </el-tag>
          <el-button class="etButton" @click="handleExtSearch" icon="el-icon-search" circle />
        </div>
      </el-col>
      <el-col v-if="params.search" :span="1" />
      <el-col v-if="params.create !== false" :offset="params.search ? 1 : 0" :span="7">
        <el-button v-if="false" class="el-button--primary" @click="handleHistory">
          <span class="btn-inner-wrapper">
            <svg
              class="table-btn__icon"
              version="1.1" xmlns="http://www.w3.org/2000/svg"
              width="15"
              height="15"
              viewBox="0 0 16 16"
            >
              <path fill="#fff" d="M14 16v-11l-1 1v9h-12v-12h9l1-1h-11v14z" />
              <path fill="#fff" d="M16 0h-5l1.8 1.8-6.8 6.8 1.4 1.4 6.8-6.8 1.8 1.8z" />
            </svg>
            История
          </span>
        </el-button>
        <el-button @click="handleClick" class="el-button--success">Создать</el-button>
      </el-col>
    </el-row>
    <el-table
      :data="list"
      style="width: 100%"
      :row-class-name="tableRowClassName"
      height="70vh"
      max-height="70vh"
      @sort-change="changeSort"
      @row-click="handleRowClick"
      v-loading="loading"
    >
      <el-table-column v-for="col in columns" :sortable="col.sortableOff ? false : 'custom'" :label="col.label"
                       :prop="col.name" :key="col.name" :width="col.width || ''"
      >
        <template v-if="hasSlot(col.name) || col.view==='link'" #default="scope">
          <template v-if="col.view==='link'">
            <a @click="col.action(scope.row)">{{ col.hrefText }}</a>
          </template>
          <slot
            v-else-if="hasSlot(col.name)"
            :name="col.name"
            :value="scope.row[col.name]"
            :row="scope.row"
          >
            {{ scope.row[col.name] }}
          </slot>
          <template v-else>
            {{ resolve(col.name, scope.row) }}
          </template>
        </template>
      </el-table-column>
      <el-table-column align="right" v-if="params.actions">
        <template slot-scope="scope">
          <el-button v-if="false" class="etButton" circle
                     size="small"
                     @click="(e) => handleHistory(scope.$index, e)" icon="el-icon-document-copy"
          />

          <el-button class="etButton" circle v-if="params.editable"
                     size="small"
                     @click="(e) => handleEdit(scope.$index, e)" icon="el-icon-edit"
          />
          <el-popconfirm v-if="params.deletable"
                         title="Удалить элемент?" confirm-button-text="Да" cancel-button-text="Отмена"
                         @confirm="(e) => handleDelete(scope.$index, e)"
          >
            <el-button slot="reference" class="etButton" circle
                       size="small" icon="el-icon-delete"
                       @click="(e) => { e.stopPropagation() }"
            />
          </el-popconfirm>
          <el-button v-if="params.downloadPool" class="etButton" circle size="small"
                     @click="(e) => handleDownloadPool(scope.$index, e)" icon="el-icon-download"
          >
            <div class="badge">
              {{ params.downloadPoolBadge }}
            </div>
          </el-button>
          <div v-if="params.downloadSecond">
            <el-button class="etButton" circle size="small"
                       @click="(e) => handleDownloadSecond(scope.$index, e)" icon="el-icon-download"
            >
              <div class="badge">
                {{ params.downloadSecondBadge }}
              </div>
            </el-button>
          </div>
          <el-tooltip v-if="params.productTariffs" class="item" effect="dark" content="Тарифы партнера" placement="top">
            <el-button class="etButton" circle size="small" icon="el-icon-s-order"
                       @click="(e) => handleProductTariffs(list[scope.$index].id, e)"
            />
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <el-divider v-if="pageable.totalPages > 1" />
    <el-pagination
      background
      :total="pageable.totalElements"
      :page-size="pageable.size"
      :page-count="pageable.totalPages"
      :current-page="pageable.number"
      @current-change="changePage"
      layout="prev, pager, next"
      hide-on-single-page
    />
  </div>
</template>

<script>
  export default {
    props: {
      loading: {
        type: Boolean,
        default() {
          return false;
        }
      },
      params: {
        type: Object,
        default() {
          return {
            search: true,
            actions: true,
            deletable: false,
            editable: false,
            downloadPool: false,
            downloadSecond: false,
            downloadSecondBadge: false,
            downloadPoolBadge: false,
            productTariffs: false,
          };
        }
      },
      pageable: {
        type: Object,
        default() {
          return {
            totalElements: 0,
            totalPages: 10,
            number: 1,
            numberOfElements: 10,
          };
        }
      },
      list: {
        type: Array,
        default() {
          return [];
        }
      },
      columns: {
        type: Array,
        default() {
          return [];
        }
      },
      searchTags: {
        type: Array,
        default() {
          return [];
        }
      }
    },
    data () {
      return {
        search: '',
        page: 0,
        timeout: null,
      }
    },
    watch: {
      search() {
        if (this.timeout) {
          clearTimeout(this.timeout);
          this.timeout = null;
        }
        this.timeout = setTimeout(() => {
          this.handleSearch();
        }, 1000);
      }
    },
    computed: {
    },
    methods: {
      resolve(path, obj) {
        return path.split('.').reduce(function(prev, curr) {
          return prev ? prev[curr] : null
        }, obj || self)
      },
      tableRowClassName(row) {
        if (row.row['__marked']===true) {
          return 'marked';
        }
        return '';
      },
      hasSlot(name) {
        return Object.keys(this.$slots).includes(name) || Object.keys(this.$scopedSlots).includes(name);
      },
      handleSearch(){
        this.$emit('searchChange', this.search);
      },
      handleExtSearch() {
        this.$emit('extSearch', this.search);
      },
      handleClick() {
        this.$emit('create');
      },
      handleHistory(index, e) {
        e.stopPropagation();
        this.$emit('showHistory', index);
      },
      handleEdit(index, e) {
        e.stopPropagation();
        this.$emit('edit', index);
      },
      handleDelete(index, e) {
        if (e) e.stopPropagation();
        this.$emit('delete', index);
      },
      handleDownloadPool(index, e) {
        if (e) e.stopPropagation();
        this.$emit('downloadPool', index);
      },
      handleDownloadSecond(index, e) {
        if (e) e.stopPropagation();
        this.$emit('downloadSecond', index);
      },
      handleProductTariffs(id, e) {
        if (e) e.stopPropagation();
        this.$emit('productTariffs', id);
      },
      changePage(page) {
        this.$emit('pagination', page);
      },
      changeSort({ prop, order }) {
        this.$emit('sort', { prop, order });
      },
      handleRowClick(row) {
        this.$emit('rowClick', row);
      },
      deleteSearchTag(tag) {
        this.$emit('deleteSearchTag', tag);
      }
    },
  }
</script>
<style lang="scss">
  .el-pagination {
    text-align: center;
  }

  .btn-inner-wrapper {
    display: block;
    position: relative;
    padding-left: 25px;
  }

  .table-btn__icon {
    position: absolute;
    top: 0;
    left: 0;
  }

  .table-btn__icon-edit {
    top: -2px;
    font-size: 16px;
  }

  .marked {
    background: #eeffee !important;
  }

  .etButton {
    float: right;
    border: 0;
    position: relative;

    span {
      margin-left: 0!important;
    }
    .badge {
      text-transform: uppercase;
      position: absolute;
      top: 2px;
      right: -5px;
      font-size: 8px;
      color: gray;
      max-width: 70%;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
  .el-button--mini+.el-button {
    margin-left: 0 !important;
  }
  .el-card {
    cursor: text;
  }

  /*.el-form .el-form-item {*/
  /*  display: flex;*/
  /*  flex-direction: column;*/
  /*  width: 100%;*/
  /*  padding: 0 20px;*/
  /*  box-sizing: border-box;*/
  /*  .actions {*/
  /*    text-align: right;*/
  /*  }*/
  /*  .el-form-item__label {*/
  /*    text-align: left;*/
  /*  }*/
  /*  .el-select {*/
  /*    width: 100%;*/
  /*  }*/
  /*  .el-form-item__content {*/
  /*    margin-left: 0 !important;*/
  /*    & > span > span {*/
  /*      display: block;*/
  /*      color: red;*/
  /*    }*/
  /*  }*/
  /*}*/
</style>
