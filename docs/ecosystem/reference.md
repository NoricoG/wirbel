## Reference

[Symbol cheat sheet](https://strudel.cc/learn/faq/#is-there-a-cheat-sheet-for-all-symbols)

```
'   marks start and end of strings, is different from "
"   marks start and end of single line patterns in mini notation, is different from '
`   marks start and end of patterns with line breaks in mini notation, is different from '
[]  used for patterns in mini notation, each item in it has the same length
<>  used for patterns, alternates between items each cycle
{}  historically used for polyrhythmic patterns. {a b c}%4 is the same as <a b c>*4.
@3  elongates the item by a factor of 3 (other numbers work too, even non-integer, but for numbers between 0 and 1 you need a leading zero like this: @0.5)
@   after an item: elongates the item once (multiple @ work too c @ @ is the same as c@3)
_   after an item: also elongates an item once (multiple _ work too c _ _ is the same as c@3), see below for a different usage.
.   this divides equal parts of a pattern and is called a foot. Can be used instead of [] like this: "1 6 7 8 . 2 . 3 . 4" is the same as "[1 6 7 8] 2 3 4"
-   silence
~   also silence
x   not silence (for the use in struct, any non-silence symbol works there)
b   decrease by one semitone, i.e. flat, works for steps of scales, note names (but not midi numbers) and chord names
s   increase by one semitone, i.e. sharp, works for steps of scales, note names (but not midi numbers) but not chord names
#   increase by one semitone, i.e. sharp works for steps of scales, note names (but not midi numbers) and chord names
#   also used in mondo notation
*3  play the sample or pattern at thrice the speed, fast(3)
!3  play the sample or pattern three times
/2  play the sample or pattern at half speed, slow(2)
?   play the pattern sometimes
|   once per cycle, choose randomly a pattern of those separated by i.e. chooseCycles()
,   play all items separated by it at the same time, i.e. stack()
:   is used to separate multiple parameters, such as adsr(".1:.1:.5:.2"), this is is an operator which creates a list of these objects.
$:  at the start of a line, defines a member of the stack. is the only stack name that should occur multiple names
_   before a stack name: mutes the stack, i.e. hush(), for example _$: s("bd"), see above for a different usage.
```
