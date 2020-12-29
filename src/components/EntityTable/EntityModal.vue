<template>
    <Modal :title="titles[type]" persistent="persistent" :actions="false" @cancel="handleClose">
        <div class="editor">
            <div class="inputs">
                <ValidationObserver v-slot="{ handleSubmit }">
                    <el-form @keydown.enter="handleSubmit(onSubmit)" label-position="right" label-width="250px">
                        <template v-for="col in fields">
                            <template v-if="col.type === FIELD_SLOT">
                                <slot
                                        :name="col.name"
                                        :col="col"
                                />
                            </template>
                            <el-form-item
                                    :key="col.name"
                                    v-if="col.type && (!('visible' in col) || col.visible()) && col.type!== FIELD_SLOT"
                                    :label="col.label"
                            >
                                <ValidationProvider :name="col.name" :rules="type===MODAL_FILTER?'':col.rules"
                                                    v-slot="{ errors }">
                                    <template v-if="col.type=== FIELD_PASSWORD">
                                        <el-input v-model="form[col.name]" :placeholder="'Введите '+col.label"
                                                  ref="col.name"/>
                                    </template>
                                    <template v-if="col.type=== FIELD_CHECKBOX">
                                        <el-checkbox v-model="form[col.name]" :placeholder="'Введите '+col.label"
                                                     ref="col.name"/>
                                    </template>
                                    <template v-if="col.type=== FIELD_EMAIL">
                                        <el-input type="email" v-model="form[col.name]"
                                                  :placeholder="'Введите '+col.label"/>
                                    </template>
                                    <template v-if="col.type=== FIELD_TEXT">
                                        <el-input v-model="form[col.name]" :readonly="!!col.readonly"
                                                  :placeholder="col.readonly ? '' : 'Введите '+col.label"/>
                                    </template>
                                    <template v-if="col.type=== FIELD_NUMBER">
                                        <el-input v-model="form[col.name]" type="number" :readonly="!!col.readonly"
                                                  :placeholder="col.placeholder ? col.placeholder : col.readonly ? '' : 'Введите '+col.label"/>
                                        <span v-if="col.suffix" :id="col.suffix"></span>
                                    </template>
                                    <template v-if="col.type=== FIELD_LABEL">
                                        <span>{{col.value}}</span>
                                    </template>
                                    <template v-if="col.type=== FIELD_TEXTAREA">
                                        <el-input type="textarea" v-model="form[col.name]"
                                                  :placeholder="'Введите '+col.label"/>
                                    </template>
                                    <template v-if="col.type=== FIELD_DATE">
                                        <el-date-picker
                                                value-format="yyyy-MM-dd"
                                                v-model="form[col.name]"
                                                type="date"
                                                placeholder="Выберите день">
                                        </el-date-picker>
                                    </template>
                                    <template v-if="col.type === FIELD_SLIDER">
                                        <el-slider
                                                v-model="form[col.name]"
                                                :min="col.min"
                                                :max="col.max"
                                                :step="col.step"
                                        >
                                        </el-slider>
                                    </template>
                                    <template v-if="col.type=== FIELD_FIXED_SELECT">
                                        <el-select :placeholder="'Выберите '+col.label" v-model="form[col.name]"
                                                   :value="form[col.name]"
                                                   clearable>
                                            <el-option
                                                    v-for="t in col.selectDict"
                                                    :key="t.code"
                                                    :label="t.title"
                                                    :value="t.code"
                                            />
                                        </el-select>
                                    </template>
                                    <template v-if="col.type=== FIELD_SELECT">
                                        <el-select
                                                clearable
                                                v-model="form[col.name]"
                                                :placeholder="'Выберите '+col.label"
                                                filterable
                                                remote
                                                :remote-method="col.selectMethod"
                                                value-key="id"
                                                :loading="loading"
                                        >
                                            <el-option
                                                    v-for="p in getSelectData(col)"
                                                    :key="p.id"
                                                    :label="col.selectField ? p[col.selectField] : p._fullName?p._fullName:p.name"
                                                    :value="col.selectValueField ? p[col.selectValueField] : p"
                                            />
                                        </el-select>
                                    </template>
                                    <span>{{ resErrors[col.name] || errors[0] }}</span>
                                </ValidationProvider>
                            </el-form-item>
                        </template>
                        <div class="actions">
                            <el-button type="primary" @click="handleSubmit(onSubmit)">
                                {{ type === MODAL_CREATE ? 'Создать' : 'Сохранить' }}
                            </el-button>
                            <el-button @click="()=>handleClose()">Отмена</el-button>
                        </div>
                    </el-form>
                </ValidationObserver>
            </div>
        </div>
    </Modal>
</template>

<script>
    import Modal from '../../components/Modal'
    import {
        FIELD_CHECKBOX,
        FIELD_DATE,
        FIELD_EMAIL,
        FIELD_FIXED_SELECT,
        FIELD_LABEL,
        FIELD_NUMBER,
        FIELD_PASSWORD,
        FIELD_SELECT, FIELD_SLIDER,
        FIELD_SLOT,
        FIELD_TEXT,
        FIELD_TEXTAREA,
        MODAL_CREATE,
        MODAL_FILTER
    } from "../../consts";

    export default {
        components: {Modal},
        props: {
            persistent: {
                type: Boolean,
                default() {
                    return true
                }
            },
            type: {
                type: String,
                default() {
                    return ""
                }
            },
            titles: {
                type: Object,
                default() {
                    return {
                        create: 'Создание',
                        update: 'Редактирование',
                        filter: 'Фильтр'
                    }
                },
            },
            form: {
                type: Object,
                default() {
                    return {}
                }
            },
            resErrors: {
                type: Object,
                default() {
                    return {}
                }
            },
            fields: {
                type: Array,
                default() {
                    return []
                }
            },
            loading: {
                type: Boolean,
                default() {
                    return false;
                }
            },
        },
        data() {
            return {
                search: '',
                page: 0,
                timeout: null,
            }
        },
        created() {
            this.FIELD_TEXT = FIELD_TEXT
            this.FIELD_SELECT = FIELD_SELECT
            this.FIELD_PASSWORD = FIELD_PASSWORD
            this.FIELD_NUMBER = FIELD_NUMBER
            this.FIELD_SLOT = FIELD_SLOT
            this.FIELD_EMAIL = FIELD_EMAIL
            this.FIELD_DATE = FIELD_DATE
            this.FIELD_LABEL = FIELD_LABEL
            this.FIELD_TEXTAREA = FIELD_TEXTAREA
            this.FIELD_FIXED_SELECT = FIELD_FIXED_SELECT
            this.FIELD_CHECKBOX = FIELD_CHECKBOX
            this.MODAL_CREATE = MODAL_CREATE
            this.MODAL_FILTER = MODAL_FILTER
            this.FIELD_SLIDER = FIELD_SLIDER
        },
        methods: {
            getSelectData(col) {
                if (Array.isArray(col.selectList)) return col.selectList;
                if (col.selectList) {
                    return this.$store.getters[col.selectList];
                }
                return {};
            },
            handleClose() {
                this.$emit('close', this.search);
            },
            onSubmit() {
                this.$emit('submit', this.search);
            }
        },
    }
</script>
<style>
    .actions {
        display: flex;
        justify-content: center;
        margin: 20px 0;
    }
</style>
