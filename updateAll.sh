tsc -p csServerComp
(cd csComp && npm install)
tsc -p csComp
(cd example && npm install)
(cd example/public && bower install)
(cd example/ && gulp all)
tsc -p example
(cd example/ && gulp built_csComp.d.ts)
tsc -p test
