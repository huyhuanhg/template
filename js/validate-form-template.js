var validate = new Validator('#form-template'); //khởi tạo đối tượng validate và truyền đối tượng cần validate
validate.validator({ //truyền các đối tượng cần validate + nội dung thông báo + icon error
    rules: {
        '#fullname': {
            required : true,
            regex : /([a-z]|[A-Z]| )|(â|ă|đ|ê|ô|ơ|ư)|(á|à|ả|ạ|ã)|(ấ|ẫ|ậ|ầ|ẩ)|(ắ|ằ|ặ|ẳ|ẵ)|(è|é|ẽ|ẹ|ẻ)|(ế|ễ|ề|ệ|ể)|(ị|ì|í|ĩ|ỉ)|(ò|õ|ỏ|ọ|ó)|(ố|ỗ|ộ|ồ|ổ)|(ớ|ợ|ở|ờ|ỡ)|(ù|ú|ũ|ụ|ủ)|(ứ|ữ|ừ|ự|ử)|(ỳ|ỵ|ỹ|ỷ|ý)/,
        }, //không bỏ trống họ tên
        '#birthday': {
            required: true,//không bỏ trống năm sinh
            number: true,
            length: 4
        }, //Năm sinh phải là dạng số dương có 4 chứ số
        '#email': {
            required: true,
            email: true, //nhập đúng định dạng email
        },
        '#password': {
            required: true,
            minLength: 6,
            maxLength: 20,
        },//độ dài từ 6 - 20
        '#password-confirm': {
            required : true,
            equalTo: '#password', // trùng khớp với #password
        },

        '#avatar': {
            required: true,
        },

        'input[name=gender]': {
            required: true,
        },

        '#marriage': {
            required: true,
        },

        '#check': {
            required: true,
        },
    },
    message: {

        '#fullname': {
            required: 'Vui lòng nhập họ và tên!',
            regex: 'Không được phép nhập chữ số hoặc kí tự đặc biệt!',
        }, //không bỏ trống họ tên

        '#birthday': {
            required: "Vui lòng nhập năm sinh!",//không bỏ trống năm sinh
            number: "Vui lòng nhập đúng định dạng năm sinh!",
            length: "Vui lòng nhập đúng định dạng năm sinh (có 4 chữ số)!"
        }, //Năm sinh phải là dạng số dương có 4 chứ số
        '#email': {
            email: "Vui lòng nhập đúng định dạng email!", //nhập đúng định dạng email
            required: "Vui lòng nhập email!",
        },
        '#password': {
            required: 'Vui lòng nhập mật khẩu!',
            minLength: "Mật khẩu tối thiệu 6 ký tự!",
            maxLength: "Mật khẩu tối đa 20 ký tự!",
        },//độ dài từ 6 - 20
        '#password-confirm': {
            equalTo: "Nhập lại mật khẩu không chính xác", // trùng khớp với #password
        },

        '#avatar': {
            required: "Vui lòng chọn ảnh đại diện!",
        },

        'input[name=gender]': {
            required: "Vui lòng chọn giới tính!",
        },

        '#marriage': {
            required: "Vui lòng chọn tình trạng hôn nhân!",
        },

        '#check': {
            required: "Vui lòng đồng ý điều khoản của chúng tôi!",
        },
    },
    icon: {
        success: '<i class="fas fa-check-circle"></i>',
        error: '<i class="fas fa-exclamation-circle"></i>',
    },
    onSubmit: function (data) {
        //call API
        console.log(data);
    }
});