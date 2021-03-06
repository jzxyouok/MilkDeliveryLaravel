
var address_message = document.getElementById('address_message');
var message = document.getElementById('alert_message');

$(document).on('click','#save',function(e){
    var url = API_URL + 'naizhan/shengchan/ziyingdingdan/save';
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="_token"]').attr('content')
        }
    })
    e.preventDefault();
    var count = 0;
    $('#delivery_milk #user').each(function(){
        count++;
    })
    var order_count = 0;
    $('#delivery_milk #user').each(function(){
        order_count++;
        var product_name = $(this).find('td:eq(4)').text();
        var product_id = $(this).find('td:eq(4)').attr('value');
        var product_name_array = product_name.split(',');
        var product_id_array = product_id.split(',');
        for(i=0; i<product_name_array.length-1; i++){
            var product_count = product_name_array[i].split('*');
            product_name_array[i] = product_count[1];
        }

        var formData = {
            customer_name: $(this).find('td:eq(3)').text(),
            address: $(this).find('td:eq(2)').attr('value'),
            type:$(this).find('td:eq(1)').attr('value'),
            phone: $(this).find('td:eq(5)').text(),
            milkman_id: $(this).find('td:eq(6)').attr('value'),
            deliver_time: $('#delivery_milk #user td:eq(7)').attr('value'),
            product_id: product_id_array,
            product_count: product_name_array,
        }

        var type = "POST"; //for creating new resource

        $.ajax({

            type: type,
            url: url,
            data: formData,
            dataType: 'json',
            success: function (data) {
                //console.log(data);
                if(count == order_count)
                    window.location.href = SITE_URL+"naizhan/shengchan/peisongliebiao";
            },
            error: function (data) {
                console.log('Error:', data);
            }
        });
    })
    // window.location.href = SITE_URL+"naizhan/shengchan/peisongliebiao";
    // self.location = SITE_URL+"naizhan/shengchan/peisongliebiao";
})


$(document).on('click','#add',function(){
    var type = $('#type option:selected').text();
    var type_val = $('#type option:selected').val();
    
    var address = $('#current_district').html()+
        $('#address4 option:selected').text()+$('#address5 option:selected').text()+$('#address6').val();
    var address_val = $('#addr_district').val()+' '+
        $('#address4 option:selected').text()+' '+$('#address5 option:selected').text()+' '+$('#address6').val();
    $('#address6').val('');
    var customer_name = $('#customer_name').val();
    $('#customer_name').val('');
    if(customer_name == ''){
        $('#name_alert').show();
        return;
    }
    var phone_number = $('#phone_number').val();
    $('#phone_number').val('');
    if(phone_number == ''){
        $('#phone_alert').show();
        return;
    }
    var milkman_name = $('#milkman_name option:selected').text();
    var milkman_id = $('#milkman_name option:selected').val();

    var time = $('#time option:selected').text();
    var time_val = $('#time option:selected').val();

    var product = '';
    var product_id = '';

    var current_last_row_number = 0;
    if(document.querySelector('#delivery_milk tr:last-child td:first-child') != null){
        current_last_row_number = document.querySelector('#delivery_milk tr:last-child td:first-child').textContent;
    }
    var last_row_number = parseInt(current_last_row_number,10)+1;

    var total_order_count = 0;
    var error_code = 0;
    $('#product_deliver tr').each(function(){
        var id = $(this).attr('id');
        if($('#amount'+id+'').val()!=''){
            var rest_val = parseInt($('#rest_amount'+id+'').text());
            var current_val = 0;
            if(!isNaN(parseInt($('#amount'+id+'').val()))){
                current_val = parseInt($('#amount'+id+'').val());
                total_order_count += current_val;
            }
            if(rest_val >= current_val)
                $('#rest_amount'+id+'').html(rest_val-current_val);
            else{
                if(rest_val == 0){
                    error_code = 1;
                    return;
                }
                $('#amount'+id+'').val(rest_val);
                $('#rest_amount'+id+'').html(0);
            }
            product +=$('#amount'+id+'').attr('name')+'*'+$('#amount'+id+'').val()+','
            product_id +=id+',';
        }
        $('#amount'+id+'').val('');
    })
    if(total_order_count == 0){
        message.innerHTML="(输入配送内容!)";
        return;
    }
    if(error_code == 1){
        message.innerHTML="(剩余量不足以交付!)";
        return;
    }
    var role = '<tr id="user"><td>'+last_row_number+'</td><td value="'+type_val+'">'+type+'</td><td value="'+address_val+'">'+address+'</td>';
    role+='<td>'+customer_name+'</td><td value="'+product_id+'">'+product+'</td>';
    role+='<td>'+phone_number+'</td><td value="'+milkman_id+'">'+milkman_name+'</td><td value="'+time_val+'">'+time+'</td><td></td></tr>';
    $('#delivery_milk').append(role);

})


$('#phone_number').on('input', function() {
    $('#phone_alert').hide();
    // do something
});

$('#customer_name').on('input', function() {
    $('#name_alert').hide();
    // do something
});

$('.street_list').on("change", function () {

    var street = $(this).find('option:selected').val();
    address_message.innerHTML="";
    var xiaolist = $(this).parent().find('.xiaoqu_list');

    xiaolist.empty();
    if (street == "") {
        address_message.innerHTML="(不是从列表中选择得到街道名称和编号!)";
        return;
    }
    else {
        address_message.innerHTML="";
    }

    var dataString = {"street_name": street};

    $.ajax({
        type: "GET",
        url: API_URL + "naizhan/shengchan/ziyingdingdan/getXiaoqu",
        data: dataString,
        success: function (data) {
            console.log("xiaoqus:" + data.xiaoqus);

            var xiaoqus = data.xiaoqus;
            var xiaodata;

            for (j = 0; j < xiaoqus.length; j++) {
                var xiaoqu = xiaoqus[j];
                xiaodata = '<option value = "' + xiaoqu + '">' + xiaoqu + '</option>';
                xiaolist.append(xiaodata);
            }
        },
        error: function (data) {
            console.log(data);
        }
    });
});

$(document).on('click','#plan_cancel',function () {
    // $('#delivery_milk #user').each(function () {
    //     $(this).remove();
    // })
    // $('#delivery_milk').tbody.remove();
    window.location = SITE_URL + "naizhan/shengchan/peisongliebiao";
})