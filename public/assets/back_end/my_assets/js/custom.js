$(document).ready(function(){
    var site_url = $('.site_url').text(), base_url = $('.base_url').text();
    
	$('.del_btn').click(function(){
		var url = $(this).data('href');
	    var id 	= $(this).data('id');
	    swal({title:'Are You Sure Delete This Data', icon:'warning', buttons:true, dangerMode:true})
	    .then((willDelete) => {
	      if(willDelete)
	      {
	        location.replace(site_url+'/'+url+'_clear/'+id);
	      }
	    });
	});

    $('#birth_date').on('change input blur', function(){
        var b_date  = $('#birth_date').val().split('-');
        var date    = new Date();
        if(b_date[2] >= date.getFullYear())
        {
            $('#birth_date').val('');
            swal({ title: 'Your Birth Date Is Invalid', icon: 'warning', button: true });
            return false;
        }
    });

    $('.modal').modal({
        backdrop: 'static',
        keyboard: false,
        show: false
    });

});

// function del(attr)
// {
//     var url = attr.data('href');
//     var id = attr.data('id');
//     swal({title:'Are You Sure Delete This Data', icon:'warning', buttons:true, dangerMode:true})
//     .then((willDelete) => {
//       if(willDelete)
//       {
//         location.replace('/'+url+'_clear/'+id);
//       }
//     });
// }

function reset(form)
{
    $(form)[0].reset();
    $('#submit').text('Save');
    $('#tagsinput').tagsinput('removeAll');
    CKEDITOR.instances.editor.setData('');
}

function reset_file()
{
    $('.file_name').text('');
    $('.file').prop('required',true);
}

function img_valid(attr)
{
    var file    = attr.val().toLowerCase();
    var ext     = /(\.jpg|\.jpeg|\.gif|\.png)$/i;
    if(ext.test(file))
    {
        return true;
    } else {
        attr.val('');
        swal({
            title: 'Please Inter A Valid Image File',
            icon: 'warning',
            button: true
        });
        return false;
    }
}

//Allow Only Nmber Digits /0-9/
function number(e)
{
    var k = e.which;
    if($.inArray(k, [0, 8, 9, 27, 13, 190]) == -1 && (k < 48 || k > 57) && (k < 2534 || k > 2543)) { return false; }
}

function oninput_num(attr)
{
    var num = Math.abs(attr.val(),2);
    attr.val(num);
}