@props(['url'])
<tr>
<td class="header">
<a href="{{ $url }}" style="display: inline-block;">
<img src="{{ url('/favicon.png') }}" width="48" height="48" alt="" style="vertical-align: middle; border-radius: 10px;">
<span style="vertical-align: middle; margin-left: 8px;">{!! $slot !!}</span>
</a>
</td>
</tr>
