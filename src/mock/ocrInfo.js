  var data = {
  "areaLimit": {
    "rules": [
      {
        "area": [
          {
            "code": "新疆维吾尔自治区",
            "name": "650000"
          },
          {
            "code": "台湾省",
            "name": "710000"
          }
        ],
        "pass_status": 1
      },
      {
        "area": [
          {
            "code": "宁夏回族自治区",
            "name": "640000"
          },
          {
            "code": "辽宁省",
            "name": "210000"
          },
          {
            "code": "吉林省",
            "name": "220000"
          },
          {
            "code": "福建省",
            "name": "350000"
          },
          {
            "code": "青海省",
            "name": "630000"
          },
          {
            "code": "江西省",
            "name": "360000"
          },
          {
            "code": "云南省",
            "name": "530000"
          },
          {
            "code": "内蒙古自治区",
            "name": "150000"
          },
          {
            "code": "广西壮族自治区",
            "name": "450000"
          },
          {
            "code": "海南省",
            "name": "460000"
          },
          {
            "code": "山西省",
            "name": "140000"
          },
          {
            "code": "陕西省",
            "name": "610000"
          },
          {
            "code": "上海市",
            "name": "310000"
          },
          {
            "code": "天津市",
            "name": "120000"
          },
          {
            "code": "重庆市",
            "name": "500000"
          },
          {
            "code": "浙江省",
            "name": "330000"
          },
          {
            "code": "江苏省",
            "name": "320000"
          },
          {
            "code": "四川省",
            "name": "510000"
          },
          {
            "code": "广东省",
            "name": "440000"
          },
          {
            "code": "安徽省",
            "name": "340000"
          },
          {
            "code": "河北省",
            "name": "130000"
          },
          {
            "code": "湖北省",
            "name": "420000"
          },
          {
            "code": "湖南省",
            "name": "430000"
          }
        ],
        "pass_status": 0
      }
    ],
    "remark": "区域限制"
  },
  "idCard_address": {
    "remark": "身份证地址",
    "rules": [
      {
        "score": 100,
        "remark": "市与区"
      },
      {
        "score": 50,
        "remark": "县"
      },
      {
        "score": 20,
        "remark": "村、镇、乡"
      }
    ]
  },
  "age_info": {
    "rules": [
      {
        "score": 0,
        "age": 18
      },
      {
        "score": 0,
        "age": 22
      },
      {
        "score": 100,
        "age": 29
      },
      {
        "score": 10,
        "age": 32
      },
      {
        "score": 0,
        "age": 35
      },
      {
        "score": 0,
        "age": 35
      }
    ],
    "remark": "年龄"
  },
  "sex_info": {
    "remark": "性别",
    "rules": [
      {
        "$ref": ".."
      },
      {
        "score": 65,
        "remark": "女"
      }
    ]
  },
  "ocr_weight": {
    "idCard_address": 20,
    "sex_info": 40,
    "area_limit": 40
  }
}
export default [{
  path: '/user/ocrInfo',
  data: data
}]

