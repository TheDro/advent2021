let testData =
    `NNCB

CH -> B
HH -> N
CB -> H
NH -> C
HB -> C
HC -> B
HN -> C
NN -> C
BH -> H
NC -> B
NB -> B
BN -> B
BB -> N
BC -> B
CC -> N
CN -> C
`

let data =
    `SCVHKHVSHPVCNBKBPVHV

SB -> B
HH -> P
VF -> N
BS -> S
NC -> C
BF -> H
BN -> H
SP -> H
BK -> H
FF -> N
VN -> B
FN -> C
FS -> S
PP -> F
ON -> H
FV -> F
KO -> F
PK -> H
VB -> S
HS -> B
NV -> O
PN -> S
VH -> B
OS -> P
BP -> H
OV -> B
HK -> S
NN -> K
SV -> C
PB -> F
SK -> F
FB -> S
NB -> K
HF -> P
FK -> K
KV -> P
PV -> F
BC -> S
FO -> N
HC -> F
CP -> B
KK -> F
PC -> S
HN -> O
SH -> H
CK -> P
CO -> F
HP -> K
PS -> C
KP -> F
OF -> K
KS -> F
NO -> V
CB -> K
NF -> N
SF -> F
SC -> P
FC -> V
BV -> B
SS -> O
KC -> K
FH -> C
OP -> C
CF -> K
VO -> V
VK -> H
KH -> O
NP -> V
NH -> O
NS -> V
BH -> C
CH -> S
CC -> F
CS -> P
SN -> F
BO -> S
NK -> S
OO -> P
VV -> F
FP -> V
OK -> C
SO -> H
KN -> P
HO -> O
PO -> H
VS -> N
PF -> N
CV -> F
BB -> H
VC -> H
HV -> B
CN -> S
OH -> K
KF -> K
HB -> S
OC -> H
KB -> P
OB -> C
VP -> C
PH -> K`

function remap(data) {
    let [sequence, conversions] = data.split("\n\n")
    sequence = sequence.split('')
    conversions = conversions.split('\n').map((line) => {
        return line.split(' -> ')
    })
    let insertions = {}
    conversions.forEach((conversion) => {
        insertions[conversion[0]] = conversion[1]
    })
    return {sequence, insertions}
}

data = remap(data)
testData = remap(testData)


export {data, testData}