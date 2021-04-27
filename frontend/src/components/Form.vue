<template>
<el-form ref="form" :model="form" label-width="120px">
    <!-- 메인 주제 이름쳐서 추가를 누르면 label이 추가되어야함 -->
    <!-- groupName, keyword 생성되어야함 -->
    <div class="groups-wrapper">
            <!-- 키워드 추가 -->
            <el-form-item label="키워드">
                <el-input v-model="form.keyword">
                    <el-button @click="saveKeyword" slot="append">키워드 추가</el-button>
                </el-input>
                <div v-if="keywords" class="tag-wrapper">
                    <el-tag @click="removeKeyword(keyword)" v-for="keyword in keywords" :key="keyword">{{keyword}}</el-tag>
                </div>
            </el-form-item>

            <el-form-item label="주제">
                <el-input v-model="form.groupName"></el-input>
            </el-form-item>

            <div v-if="keywordGroups">
                <el-tag @click="removeGroup(group.groupName)" v-for="(group, index) in keywordGroups" :key="index">{{group.groupName}}</el-tag>
            </div>

            <el-button @click="saveGroup" type="primary">주제 생성하기</el-button>
    </div>

    <div class="groups-wrapper">
    <!-- 기간 -->
        <el-form-item label="시간대별 설정">
            <el-col :span="11">
                <el-date-picker type="date" placeholder="pick a date" v-model="form.startDate"></el-date-picker>
            </el-col>
            <el-col class="line" :span="2">-</el-col>
            <el-col :span="11">
                <el-date-picker type="date" placeholder="pick a date" v-model="form.endDate"></el-date-picker>
            </el-col>
        </el-form-item>
                
            <el-form-item label="구간 단위">
                <el-radio-group v-model="form.timeUnit">
                    <el-radio label="date"></el-radio>
                    <el-radio label="week"></el-radio>
                    <el-radio label="month"></el-radio>
                </el-radio-group>
            </el-form-item>

            <el-form-item label="디바이스">
                <el-radio-group v-model="form.device">
                    <el-radio label="all"></el-radio>
                    <el-radio label="pc">pc</el-radio>
                    <el-radio label="mo">모바일</el-radio>
                </el-radio-group>
            </el-form-item>

            <el-form-item label="성별">
                <el-radio-group v-model="form.device">
                    <el-radio label="all">모두</el-radio>
                    <el-radio label="f">여자</el-radio>
                    <el-radio label="m">남자</el-radio>
                </el-radio-group>
            </el-form-item>

            <el-form-item label="나이">
                <el-select v-model="form.age" placeholder="전 연령">
                    <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option> 
                </el-select>
                <br>
                <el-button @click="saveAge" type="primary">나이 추가하기</el-button>
                <br>
                <el-tag @click="removeAge(age)" v-for="age in ages" :key="age">{{age}}</el-tag>
            </el-form-item>
        </div>

        <el-form-item>
            <el-button @click="onSubmit">Create</el-button>
            <el-button>Cancel</el-button>
        </el-form-item>

</el-form>
</template>

<script>
import {dataLap} from '../utils/axios';
import moment from 'moment';
import {mapActions, mapState} from 'vuex';
    export default {
        data() {
            return {
                form: {
                    startDate: null,
                    endDate: null,
                    timeUnit: 'month',
                    groupName: '',
                    keyword: '',
                    device: 'all',
                    gender: 'all',
                    age: '',
                },
                ages:[],
                keywordGroups: [],
                keywords:[],
                options: [{
                    value: '1',
                    label: '0 ~ 12세'
                }, {
                    value: '2',
                    label: '13 ~ 18세'
                }, {
                    value: '3',
                    label: '19 ~ 24세'
                }, {
                    value: '4',
                    label: '25 ~ 29세'
                }, {
                    value: '5',
                    label: '30 ~ 34세'
                }, {
                    value: '6',
                    label: '35 ~ 39세'
                }, {
                    value: '7',
                    label: '40 ~ 44세'
                }, {
                    value: '8',
                    label: '45 ~ 49세'
                }, {
                    value: '9',
                    label: '50 ~ 54세'
                }, {
                    value: '10',
                    label: '55 ~ 59세'
                }, {
                    value: '11',
                    label: '60세 이상'
                }],
                value: ''
            }
        },
        methods: {
            ...mapActions(['generateChartData']),
            saveKeyword(){
                if(this.form.keyword){
                    this.keywords.push(this.form.keyword);
                }
                this.form.keyword = ''
            },
            saveGroup(){
                if(this.form.groupName){
                    this.keywordGroups.push({
                        groupName: this.form.groupName,
                        keywords: this.keywords,
                    })
                    this.form.groupName = '';
                    this.keywords = [];
                }
            },
            saveAge(){
                if(this.form.age){
                    this.ages.push(this.form.age);
                }
            },
            removeKeyword(keyword){
                this.keywords = this.keywords.filter((li)=> li !== keyword)
            },
            removeGroup(groupName){
                this.keywordGroups = this.keywordGroups.filter((li)=> li.groupName !== groupName)
            },
            removeAge(age){
                this.ages = this.ages.filter((li)=> li !== age)
            },
            async onSubmit() {
                const {startDate, endDate, timeUnit, device, gender} = this.form;

                const makeDate = (date) => {
                    const toCalendarData = new Date(date);
                    return `${toCalendarData.getFullYear()}-${toCalendarData.getMonth()}-${toCalendarData.getDate()}`
                }

                if(this.keywordGroups.length && startDate && endDate && timeUnit && device && gender){
                    const data = {
                        keywordGroups: this.keywordGroups,
                        startDate: moment(startDate).format("YYYY-MM-DD"),
                        endDate: moment(endDate).format("YYYY-MM-DD"),
                        timeUnit,
                        device,
                        gender,
                        ages: this.ages
                    }
                    console.log(data);
                    const result = await dataLap.post(data);
                    // console.log(result);


                    if(result.data.status === "OK"){
                        console.log("OKOKOKOKOKOKOK")
                        this.generateChartData();
                    }
                    
                }
                else{
                    alert("빈 값들을 입력해주세요.")
                }
            }
    }
  }
</script>