@extends('old-blade.default')
@section('content')
    <div class="container">
        <div class="row justify-content-center my-5">
            <div class="col-md-8">
                <div class="input-group input-group-lg">
                    <div class="input-group-prepend">
                        <span class="input-group-text" id="name">Enter Your Name:</span>
                    </div>
                    <input type="text" class="form-control">
                    <div class="input-group-append">
                        <button class="btn btn-primary" type="submit" id="submit">Submit</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection
