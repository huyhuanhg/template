class Validator {
    formID;
    formGroup;
    formElement;

    constructor(formID, formGroup) {
        this.formID = formID;
        this.formGroup = formGroup != null ? formGroup : '.form-group';
        this.formElement = document.querySelector(formID);
    }

    /**
     *
     * @param options object truyen vao
     */
    validator(options) {
        var object = this;
        this.formElement.onsubmit = function (e) {
            e.preventDefault(); //dừng Submit
            var isFormValid = true; //Biến kiểm tra form hợp lệ chưa

            //Lặp qua từng rule và validate
            // dùng for-in nhé
            Object.keys(options.rules).forEach((inputSelector) => {
                var isvalid = object.validate(options, inputSelector, options.rules[inputSelector]);
                if (!isvalid) { //nếu false thì form k hợp lệ
                    isFormValid = false;
                }
            })
            if (isFormValid){
                var formElement = this;
                if(typeof options.onSubmit === 'function'){
                    var enableInputs = formElement.querySelectorAll('[name]:not([disabled])');
                    var formValues = Array.from(enableInputs).reduce(function(values, input){
                        switch(input.type){
                            case 'radio':
                                values[input.name] = formElement.querySelector('input[name='+input.name+']:checked').value;
                                break;
                            case 'checkbox':
                                if(input.matches(':checked')) {
                                    values[input.name] = input.value;
                                    return values;
                                }
                                if (!Array.isArray(values[input.name]))
                                    values[input.name] = [];
                                values[input.name].push(input.value);
                                break;
                            case 'file':
                                values[input.name] = input.files;
                                break;
                            default:
                                values[input.name] = input.value;
                        }

                        return values;
                    },{});
                    options.onSubmit(formValues);
                } else formElement.submit();
            }
        }
        Object.keys(options.rules).forEach((inputSelector) => {
            var inputElement = document.querySelector(inputSelector);
            inputElement.onblur = () => {
                this.validate(options, inputSelector, options.rules[inputSelector])
            }
            inputElement.onfocus = () => {
                var formGroupElenment = this.getParent(inputElement);
                if (formGroupElenment.classList.contains('error')) {
                    formGroupElenment.querySelector('.icon').remove();
                    formGroupElenment.querySelector('.error.msg').remove();
                    formGroupElenment.classList.remove('error')
                } else if (formGroupElenment.classList.contains('success')) {
                    formGroupElenment.querySelector('.icon').remove();
                    formGroupElenment.classList.remove('success')
                }
            }
        })

    }

    validate(options, inputSelector, rules) {
        let inputElement = this.formElement.querySelector(inputSelector);
        var formGroupElenment = this.getParent(inputElement);
        var errorMessage;
        // Lấy ra các rule của selector
        // Lặp qua từng rule và kiểm tra tồn tại lỗi

        Object.keys(rules).every((rule) => {
            var param = options.rules[inputSelector][rule];
            var msg = options.message[inputSelector][rule];
            switch (inputElement.type) {
                case 'radio':
                case 'checkbox':
                    errorMessage = this[rule](param, msg)(formGroupElenment.querySelector(inputSelector + ':checked'));
                    // errorMessage = rules[i](
                    //     formElement.querySelector(rule.selector + ':checked')
                    // );
                    break;
                default:
                    errorMessage = this[rule](param, msg)(inputElement.value);
            }
            if (errorMessage) return false;
            return true;
        })

        if (errorMessage) {
            if (!formGroupElenment.classList.contains('error')) {
                var labelMsg = document.createElement("label");
                var iconError = document.createElement("label");

                labelMsg.className = 'error msg';
                iconError.className = 'icon';

                labelMsg.innerText = errorMessage;
                iconError.innerHTML = options.icon.error;

                formGroupElenment.appendChild(labelMsg);
                formGroupElenment.appendChild(iconError);
                formGroupElenment.classList.add('error');
            }
        } else {
            if (!formGroupElenment.classList.contains('success')) {
                var iconSuccess = document.createElement("label");

                iconSuccess.className = 'icon';
                iconSuccess.innerHTML = options.icon.success;

                formGroupElenment.appendChild(iconSuccess);
                formGroupElenment.classList.add('success');
            }
        }

        return !errorMessage;
    }

    getParent(element) {
        while (element.parentElement) {
            if (element.parentElement.matches(this.formGroup) || element.parentElement.matches(this.formID)) {
                return element.parentElement;
            }
            element = element.parentElement;
        }
    }

    required(param, msg) {
        return function (value) {
            // if (value){
            //     return value.trim() ? undefined : message || 'Vui lòng nhập họ tên!';
            // }else{
            if (param) return value ? undefined : msg || 'Vui lòng nhập trường này!';
            return undefined;
            // }
        }
    }

    email(param, message) {
        return function (value) {
            var regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if (param) return regex.test(value) ? undefined : message || 'Bạn nhập sai email!';
        }
    }

    length(param, message) {
        return function (value) {
            return (value.length == param) ? undefined : message || 'Độ dài không hợp lệ!';
        }
    }

    minLength(param, message) {
        return function (value) {
            return (value.length >= param) ? undefined : message || 'Độ dài tối thiểu không hợp lệ!';
        }
    }

    maxLength(param, message) {
        return function (value) {
            return (value.length <= param) ? undefined : message || 'Độ dài tối đa không hợp lệ!';
        }
    }

    number(param, message) {
        return function (value) {
            var regex = /^\d+$/;
            if (param) return regex.test(value) ? undefined : message || 'Định dạng số không chính xác!';
        }
    }

    equalTo(param, message) {
        return function (value) {
            var confirmPwValue = document.querySelector(param).value;
            return value === confirmPwValue ? undefined : message || 'Nhập lại mật khẩu không trùng khớp!';
        }
    }
    notRegex(param, message) {
        return function (value) {
            for (const val of value) {
                if (param.test(val)) return message || 'Định dạng nhập vào không chính xác!';
            }
            return undefined;
        }
    }
    regex(param, message) {
        return function (value) {
            for (const val of value) {
                if (!param.test(val)) return message || 'Định dạng nhập vào không chính xác!';
            }
            return undefined;
        }
    }
}