let fileArr = [];
let emailTest = /^(|(([A-Za-z0-9]+_+)|([A-Za-z0-9]+\-+)|([A-Za-z0-9]+\.+)|([A-Za-z0-9]+\++))*[A-Za-z0-9]+@((\w+\-+)|(\w+\.))*\w{1,63}\.[a-zA-Z]{2,6})$/i;
let nameTest = /^([А-Яа-яё -]{1,50}|[A-Za-z -]{1,50})$/;

document.addEventListener('click', function (evt) {
    if (evt.target && evt.target.closest('.navigation__open')) {
        let target = evt.target.closest('.navigation__open');
        let navList = document.querySelector('.navigation__list');
        target.classList.toggle('active');
        if (target.classList.contains('active')) {
            navList.classList.add('active');
        } else {
            navList.classList.remove('active');
        }
    }

    if (evt.target && evt.target.closest('.navigation__link')) {
        let navList = document.querySelector('.navigation__list');
        let menuOpen = document.querySelector('.navigation__open');
        navList.classList.remove('active');
        menuOpen.classList.remove('active');
    }

    if (evt.target && evt.target.closest('.order-form__input--system')) {
        let target = evt.target.closest('.order-form__input--system');
        let parent = target.closest('.order-form__label--system');
        parent.classList.toggle('select-active');
        parent.classList.remove('error');
    }

    if (evt.target && !evt.target.closest('.order-form__label--system')) {
        let mainSelectLabel = document.querySelector('.order-form__label--system');
        mainSelectLabel.classList.remove('select-active');
    }

    if (evt.target && evt.target.closest('.order-form__input-file-delete')) {
        evt.preventDefault();
        let fileLabel = document.querySelector('.order-form__label--file');
        let fileNameTitle = document.querySelector('.order-form__input-file-name');
        let fileInput = document.querySelector('.order-form__input--file');
        fileNameTitle.textContent = '';
        fileInput.value = '';
        fileArr = [];
        fileLabel.classList.remove('uploaded');
    }
})

function setFile(fileArr) {
    let fileLabel = document.querySelector('.order-form__label--file');
    let fileNameTitle = document.querySelector('.order-form__input-file-name');
    if (fileArr.length > 0) {
        fileLabel.classList.add('uploaded');
        fileNameTitle.textContent = fileArr[0].name;
    } else {
        fileLabel.classList.remove('uploaded');
    }
}

document.addEventListener('change', function (evt) {
    if (evt.target && evt.target.classList.contains('system-select__radio-input')) {
        let target = evt.target;
        let mainSelect = document.querySelector('.order-form__input--system');
        let parent = document.querySelector('.order-form__label--system');
        mainSelect.value = target.value;
        parent.classList.remove('select-active');
    }
    if (evt.target && evt.target.classList.contains('order-form__input--file')) {
        fileArr = [];
        fileArr = Array.from(evt.target.files);
        setFile(fileArr);
    }
})

function sendform() {
    if (document.forms[0].systemtype.value == "") {
        document.forms[0].systemtype.focus();

        let parentLabel = document.forms[0].systemtype.closest('.order-form__label')
        parentLabel.classList.add('error')
        return false
    }

    if (document.forms[0].email.value.length >= 0) {
        let parentLabel = document.forms[0].email.closest('.order-form__label')
        if (document.forms[0].email.value == "") {
            document.forms[0].email.focus();
            parentLabel.classList.add('error')
            return false
        }
    }

    if (document.forms[0].name.value == "") {
        document.forms[0].name.focus();
        let parentLabel = document.forms[0].name.closest('.order-form__label')
        parentLabel.classList.add('error')
        return false
    }
    return true;
}


document.addEventListener('input', function (evt) {
    if (evt.target && evt.target.classList.contains('range-bar__input')) {
        let target = evt.target;
        let setValue = document.querySelector('.range-bar__value-data');
        setValue.textContent = `${target.value} %`;
    }
    if (evt.target && evt.target.classList.contains('order-form__input--mail')) {
        let target = evt.target;
        let parentLabel = target.closest('.order-form__label');
        if (target.value.length >= 0) {
            parentLabel.classList.remove('error');
        }
    }

    if (evt.target && evt.target.classList.contains('order-form__input--name')) {
        let target = evt.target
        let parentLabel = target.closest('.order-form__label');
        if (target.value.length == 0) {
            parentLabel.classList.remove('error');
        } else if (target.value.length > 0) {
            if (!(nameTest.test(target.value))) {
                parentLabel.classList.add('error');
            } else {
                parentLabel.classList.remove('error');
            }
        } else {
            parentLabel.classList.add('error');
        }
    }
})

document.addEventListener('DOMContentLoaded', function (evt) {
    let rangeInput = document.querySelector('.range-bar__input')
    let setValue = document.querySelector('.range-bar__value-data')
    setValue.textContent = `${rangeInput.value} %`
})
