A small script I use to help with time tracking. I have my daily activities in a file like this:

```markdown
# 16.04.2024

1000 daily
1015 fix bug
1200 lunch
1300 add button to dashboard
1700 done
```

The script (`npm run calc`) writes the number of minutes each activity takes to the end of the line:

```markdown
# 16.04.2024

1000 daily (15)
1015 fix bug (105)
1200 lunch (60)
1300 add button to dashboard (240)
1700 done
```