<html>
<head>
    @include('old-blade.head')
</head>
<body>
<header>
    @include('old-blade.header')
    @include('old-blade.navbar')
</header>
<div class="content">
    @include('old-blade.alert')
    <div class="container pt-3">
        @yield('content')
    </div>
</div>
<footer>
    @include('old-blade.footer')
</footer>
</body>
</html>
