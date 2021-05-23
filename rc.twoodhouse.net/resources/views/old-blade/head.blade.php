<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" /><meta name="description" content="">
<meta name="viewport" content="width=device-width, initial-scale=1.0">


<title>{{ config('app.name', 'Laravel') }}</title>

<!-- CSRF Token -->
<meta name="csrf-token" content="{{ csrf_token() }}">

<!-- Scripts -->
<script src="{{ asset('js/app.js') }}"></script>
@yield('scripts')

<!-- Fonts -->
<link rel="dns-prefetch" href="//fonts.gstatic.com">
<link href="https://fonts.googleapis.com/css?family=Lato" rel="stylesheet">

<!-- Styles -->
<link href="{{ asset('css/app.css') }}" rel="stylesheet">

