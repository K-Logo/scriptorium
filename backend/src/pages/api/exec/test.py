import sys
 
ctr=0
w1=None
w2=None
for line in sys.stdin:
    if 'q' == line.rstrip():
        break
    elif ctr==0:
        ctr+=1
        w1=line

def reverseVowels(s: str) -> str:
    S = []
    replace = set()
    for i in range(len(s)):
        if s[i] in {"a", "e", "i", "o", "u", "A", "E", "I", "O", "U"}:
            S.append(s[i])
            replace.add(i)
    newS = ""
    for i in range(len(s)):
        if i not in replace:
            newS += s[i]
        else:
            newS += S.pop()
    return newS

print(reverseVowels(w1),end="")
