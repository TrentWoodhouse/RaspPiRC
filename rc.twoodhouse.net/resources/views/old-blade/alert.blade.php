@if(Session::has('alert'))
    <div class="container pt-3 ">
        <div class="alert alert-{{ Session::get('alert')['type'] }} mb-0" role="alert">
            {!! Session::get('alert')['message'] !!}
            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
    </div>
@endif
