import React, { useState, useMemo, useEffect, useCallback } from "react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Flame, Calendar as CalendarIcon, UtensilsCrossed, ShoppingCart, ClipboardList,
  Moon, Sun, Plus, Minus, Trash2, Search, X, MapPin, Users, Clock, Pencil,
  ChevronLeft, ChevronRight, CheckCircle2, ReceiptText, RefreshCw,
} from "lucide-react";

/* ============================================================
   POPPAZ SMOKE BBQ — Operations Dashboard / POS
   ------------------------------------------------------------
   This is a working front-end demo running entirely on in-memory
   mock data. Every place the app would write to or read from
   Google Sheets is routed through `sheetsService` below — swap
   those function bodies for real Sheets API calls (see the setup
   guide) and the rest of the app needs no changes.
   ============================================================ */

const TAX_RATE = 0.0825; // Texas-style sales tax; adjust to local rate

// Your deployed Apps Script Web App — reads/writes the Operations Data spreadsheet.
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxCsIOSpjuyBMNaSub32xu4Q7CzxSSdSAbmBEaMHtBXZDbXL_7snyhx9oC0pG5pavmC/exec";

// Brand logo (provided by Poppaz Smoke BBQ), inlined as a data URI so the
// artifact has no external file dependency.
const LOGO_SRC = "data:image/webp;base64,UklGRppTAABXRUJQVlA4WAoAAAAQAAAAPwEA1AAAQUxQSC0iAAABDMVt2zjS/mMnuV6+ETEBnNKhOGJr66CiOsBmrBnZ1Nzn+G0YxsB/YAyrMHgjhncxsYPpKj/rD9v+xU38/xtJ0iRNqkDdi0vRFnvh7iy6sPAq7u7u7ixS3N1ll4XF3R2Ku1aoN5k8n895HEfmORN2j9dM+98rIlzRtg0319SYKp4+j7Tor99Ikizbtm2LtEnYJGHytBa8SJjYghYB//GpCBcZLdzcq6MLiQhptLWGbfO1ZZUiqVjAJyQ72X8m36f+7z/+jwSWYVk2H+djYBnOkC+ij6Q4jlVWHMfxDMfwIS3rlDFw+TVP3qtQt6UPvyQOZPn8jeYKRlSv/Gv7asULe5iMBn1geEFf78gaDdr26tV2YhIAQM54E8/lZ4x3jUbxc59/TXlz/8+jO/bsuHD39O4991OSzx3tWWcv2DHB8HleMJ+fIJTEYXllL9ig8fpnNgyKyoE/z+/YvkLDLUmARZGAsCJan28IpMOwImTk6c8AIiEYYUwwlgpgF5Jm14ir2HjpjkTk1E7/9ZGeeb4AxcolyNrNG4TKCcgy3nPvXtx6305EyRZFKZ5TE4BDTTp1Hz18bgYQkRAxaUr9/1ERlKUFD2XRQ2NI5aJ+GNbkHZ4g2LIezyxegBbKueod44pFdfmeKkjUkSkpkMCG3vFNG/Y7/iQbCEHwcX8dPfPve9D0+PlWJPP5qdrSpPELY/A0+IeGDz0BIhEBXl6YGihlY/G2uJl8673LdAJTICg34+vtS9kkbUPXzs3adpl0mxCnJ0IvBvgb/20OJS+A8/4UGZUyLfV6nZOJ6fUeYaE6r7IVgsIKWTRloBBexN8gqyLPTut2zhq1aPnpb0hAGGMAuF2P4TmzzlCgaIttdkRE2QVJu39qe8Lcy9/scHHznHm7TicKUoEcNhBOrukSE87/S2EcJbjqjcEFPC0/16j1Vn+ndNZ7+LRRQ5cs3H/097Xrl19+n3j98bFpY9sXMpuMvCZEL9N/4KA2AVJVefoO/obJh5tJ2ckOp8KiKPVNJ/pUivDxCizd48R3wFRcylt4cP7EiT1nElNtiORmO7BUHjkzFt4sKaX7l9iVoWjDHmOWbz27+8jKEW3LxBT3NzEs/VFwL/5Ll6EHb/21ZvnF7KRMG5G4lD01TQBEyxwpe4bVLOmrc94eq/IUgT1PJr65ML6oR6ClRKdPICBCchHBzrRIohEWMr9uH9im1dCt7wGo3OTx7GmpmUJuLiZYBFG6IlQ5nR4YIH12sOEfS2XOeMWGnvicJchkMZz1+s3HU5NjrHozW77rrCOPbALQSuLwElMiACJCtNCBRSHlVJeSkeFRFnWP+Qy+ndakAYhp51vWKlZiIjik+sGEZq1AZSGil3+ev5lOQF4cERSiUP6yUlBRqWKAiCGxvuGnx5EsR/kwvk1nXwWKIhhjByYSnyfvD/YKNhca9hpTN0QQIYROK7szAvISiISQJwvGjxhSy8ts4d1VGp0zehYe+BFjbLs3u9vAur9dcCC6V5dBJE4Qh8OWTogkWRIlAFVxUgFk/lR0OTFFkrK0vvmfiEDh7cdtvycAEEyIshxmPzwxPrbVCUGSIahmQlt0i6AglYACRUNbxtODU3r37upRSa9SsEXanAGRQPqlI5cOddn07ecMMsPFfjLyxwx6W9ypO1odnAAw3C+Udmb1jMaBRlbvomehWG10nd//dvz64wpL+Hwlz+q25hs8z2puKH1wvT2D5v5vbyb+efliy2qcKh2Lf8s5J21EIoxdsP84vOL7p5cHps+bmZG4Ap3dbOX+ThDtVwdOmtKsWIkWVfScUjthdNXWnP8hHP58hmPM6m1XHtkBnatHrFiQj9AVkfEj9fniGI5TW3/F8+aS3e6c/WKjqk2SkZIfn6RSZB3jBIKcZxFMwKRDzouE31o2Gn48cUMlEyvrqiyhbde/prqox3W3keCyhIyUXBAXIIcMfPFUTgjZzuz8srcKw6nNN7JyfPyFu4c+2DHQH16MwdkC2IHwOF/shL90J9iHJmCSdW3/tZzM12s6lvOzFNDzOkuJdtu+AyA5q5UtR1Q4zR1SN5WxQmsFIWZ9fT+t/oDOASp7zZcu0Xv0xNMoLTkNE3kNEkI4akgZC1iAuCDwUCyVwZH87dSogV1aNg5y94pdlqSYHv3DsQuypAWkYy6PDwUQDCnX/mxVspDVqLL+yr1i0w23T9sk1oeJchsf8HazJYK6uQZUyNVANQYHsjtsj25t6FeneHjtuW9lkpdyD8jCvn/OgnZpWSBIcDzcNK9GGW+9SWXQmWocEQERQnVUdFUoQB1gkUlTtxJ4Z4CclRCRZFwd2rRxo/VZQH9iXDEcAqvRCacQUIjYpHFZ4oTmMX7O1GqzKnX/ICKaMHI2pgStoC3AJ9qB00/bE/pRYpgO4ePO7duP2wArFnhl8MsSLEQu4UEFArTF2VJzQmfm1LSqzLCMR6+lmzOokYZjSIAV2wJXg7OjJbmpvDA/fkgnkSSFLdpSp4u2CXRV8ibUABIORlkZtSGwVZP4hNOpaAuBE7MTxERc4S8Gf/Yw8Brbt7sXzQpPwFxMALRfcAQZ0nNEQIjAu9V1zeob9JjdTH6lh+78aFa4cLGImR6xyVGIASYhuTb089YUDG79xptEJEZHMgMCX45fefJd/P5qS6Mi/joVjnncDKaomkPu/viI1MQ9vYAX+oEom7/wX6ihNY2Dmh9xXCXh1UByyuP7W2bOmTls3apelf0LmFkVwqRjfMv3O/0fDcFDed3P9vpZtFYT/lAThXCrqVJnhq4Z30CkFSEfzkwaPbRtgxaNSwaZVfiK1esNvHu1pQ+eOYeGJGC2Ag1HtqiACh2k6VaSM5N+0w+E1SgMBEu9oOP23tVz+/9SNcbf3cCpb7bRyOssIW1vfL1wAZ0YKsA/B6GAo4IOMk7edUeB2AZyEIKRIBARhA+pby/tbFre18KzqotpdTN5x8Qv+/Dt2/O4fVbYvMbw1KONP0DfxVEBlNOqMnyFeStyvj+5g2kuA0/6xEYW0qsN1ubdS3gVKN54zJGvgiL2ayAKeyooUIJxRRJqCBtWRSu8ANC5Kfn9z0OXUkTqA5CTsqFu5UImnbqmLPTBW9Jn1/1t4cRZK04qTDS6DwdrpW71QNEqwtw9oh3+BSZhoYlkT3pCTfliu3AnYV67EC8VZcBxBr33oJeQaIcVHaceSE5NRUBcv5Vny+ncB74aFAI6Xx06MFEoQLkbA/meeowlfti6pWtxPzV5GYNabL33d0ri1F6lqs77nPT57XeBVIDpAYhW65R3BqT+kiMveAm5ScBSNVwuNXuJBLvwfnPbdm0qWjnVuLFjNp88c3Nnu3EtixXtfCwbiP3VO6ASpCG84NPLA70Wu7jcYyG5RMo7A77m3BE5nMjNfPNxc9dGcUXCOXWI7ixraDpj5/W3r36f2LeKpfx+oKqJvN7x5ca7G0qrXI3RTSJ1w7y9EqYcGZmwhqKgcN8gnZvRc8zo5bluTePCClqcrjrAhUeU6Lt1RfN6RX0GfwYRUczr26ZXAv+mxSJWT124rICWyInnxgw0hYPFVjbjvoHkEEViezmjvIePt5FVi5++YFjc4KpFiugrHQfAcnpg+kIX/l1gL8qC+XsWu/zHPPpT9RFtNQBsmBYDqijPB3kzDK+aCTPOZPHw4jz/+KHn4+TXCj/JxyEzN/F63yhxmFwdii90X4YLC6bejBAggAXYzaE3E/xV9UURN6bCnV+1l8RsmUDgBE6GzyoFt3JyE6wVAd7rQILfGvSvxMCMHwF8naRnWbWAYUbZ4IevNvf2HJwFym67fTB+3y+l7LMz3bkFm9INCWYOdmYD8XMPVD0sVqQVB6T7GT2PsYXl1OIV+ScAun7kOEa6M+hYCgltajovMAWfFEDDgqIz7gvpGHwAE9J9gihQj8ztfgynjsQhH8Gh2MR0EcSZaleDMNY3mElsC1QYA4Ga8OpHJlV1jDEPUokZKnBMUJmIGK7r1WHpmJ5gl92+YPY5wgMBehZ44oMMWux7jEO5gCpJGGaMkHcyMO/cNFDiH8k/N5jUYXiVhDcCpNBP6fiz2UcEC1cy0kXc2+BA4AJiVjD14r5nEhn7T8AMeY9Ig6ZAE5ggWKeaTDnuCiCqOUM3WkmSU/nTau25BXi5+zdFNyqCPU0xRxaPq/ELsGRSwuDtELxeZARwnGpSxiLJgXi8a3zxLbKgF17dN+BFnrY7GPcxiEgJmQYDyMLt7lolhegHszDZyREZ1egpTi+6M0zBTmbUImy9eQ1YrNlDMQgw9KMwLYY8xmCvinSP1f6NxDcWjlXRtK3uEiW0gwg7C5zSCfftB9kW8yOEgqC5jUGRm5yVk/xZBzfdQGyAgkDQng5XSzATlo5HW2Hl+26bPZixWRD+BINaYZONhqHExyyxfm2OplukB2fgHE4CylxSMip5hx7wg9xmkClgTgtXZ7bgFJsoASp8TrFjuCIz7sD1bXXf/kEse8BQbFkcYFLVCZXpXfbel3Hj0Nxsfm6pQxDo1MHVBci3Cidex1EhgUQssEIHDtitZFTzDt5/1yN2Qmh7SRAAKrwS9FQ+KMQnrOgUANQnVF5A9eyFuwgIfjQU50QqDLlVlOFv35/1wsos1SBk1tRuIsgergoey4JHgLIJ4sKmcx/ASFTgm2JOdxrtqs1rGCClKODUuKZA8ix5RpQeEUxQGijet0dK0i75biWEUGzCFCyjKRbfSm+hRn1S8lJidoDn6kHoqvVKKOVHLizOFe/bn4jiJuBIsnMfcPYM6j4QtGB4df7eKTyVEBdCpEDY5A51mwpbN9Fi3unRvhXFFmQ+cEEZO+muFQDBAcqo0mkFiKLAs8vBOmaPd+s02pnBOY1As9xtwvOHKILLfOD0oGtRkdpAeTgryplGrXoeIIWml5ogcCpf7xuPd2JOiEkUXkhECqZpnrumyJIDvQHBPEan2t8b6/jzgAhzasCZZfNGhacsWCxzwQyZgXnaDFwsY4yGM2QgVjZCIeSLr2ytKvXGgYbe7oaos92Z01AYohYS3tx1wqOGxcIQwD9InfvCxT4G93CBO2ASgaCDM1y9Ss/0lJxnzLUI4Ljs0+6qFLpcuNYh7qTjxqKJoMm1K0NyCxK0jqMVkQiCP1RtmAB/3X5ALnoLFx/Qc+sW1fnWkfv1tXl+FkJUZ2EVlWPtl4Np5haUqslepgYhyYEsp2YERwWVegGIEBF+PgrNadeNBWoigblE1bG7wBQhrFK1Am4MEBB0VrfL6rzDyvTPBCSLgcB8iAuqBopgZ/epJlpHIYU/gBxfNZG112IBwWon61O1cotqUavDig8iprmd2WFytKofqPF1ZwK9eW6OEky4ghBWaiCZ0wD2FzDcifBx41g1r3DkFRffZdj6F1iWzOntNZTOF0jc2XVQkwRK0tRBF2Co6xs8IeN/6evwRuGebgZWvX66QiXqD154JRUThYqdW7gTzgUpV8vnNBxi+UqOD7tyk9wopFOmVsBq0IP4UgncHdmiQnREgE69Yqdn0aqzL77PFpQFpYABxCItdHYw5Ja2JohrYR8JB9JeoYQ8EC9v1/DeDj9f3bNJ/dhwvTodTh/Yqk7XTe/Ts2XjbppdN6Pdu2zvOwssSMa5nG1WBxK+gHSU44eSsoGmB+cF5C28enIw25ODk6tVDC9gVKXD8n4Hfzx8h6ilcYhy9aC33zT6pNLDzz0onfgYDwrNjoqE7AEB5hQmE8SsScBrkkA/nP58V9MK0SFGM6/G3Dx7XFN4CERkNZMgcMN18E8UaXHyfyIksdaGQEZkGRY4DPEUQSkb2seULh0SYFKjY47fmEGQUkdFUyo5Ls3lxtV5poLZd9J2h/NO8+Bod7vyfdK5hVEEaAvRBf6Vcmpgm4oxpYtY9Jwa13qz9vgmyUvyLkJ+KRAX7JrPdHmnqRi8vMjbiYrJD4iIL4Yw8L5t/Il38NHdPYuH9mhRq1TpetXMqhQ6S9yXqgrL1/0QNWeQSaqBiD7Bs5kg1X4RuRDRnosxA5p4jhbdvvHU49znr19dOLxj/dSElQ05VSZk2r7KBgA6khwysTy5QUx8chAL4Nft+078Na7KTdLnLszEJs7AoIQdY0jdVt2sTm3usOLyp7vvXr1KevVZYYxzsSUGoVQIQ+d36wBiwsDVfEXtvnu5cPyLUAXEOWsreKp07GMs1rrdr0sWD58//bVdqXeG/XVx3x7vYqXpd3+H9sXLFhVXJKwE1RYGvhhcpfh3CKsFGXchHw90D9epdq1kE2+Nrllr6nsg4LCCR2dAaseGQgVdkJtiNEAdRw9d1iyAmsQA4iEIdmTeOhhvVfG6qyzn4df+EQhSzab5l5AaOmutObCuEkXPSMwYHROJmygYsaNUUBqIvkQO2+nF1dW9tL6u5Lov2UjWxoTNHTjQLx2sSSy4ziRMEWix/Iui5titElsMZKbE9izb52MtalQ286resabDmu82OiuKSbNi2QS0Qm/W5p9t3jEWTEmamv6BzF8Crolk/viwp3WQtUIkr2anbPzepEy6bQtD/Avfd5fdW7gHAONytikzEDkJ2gsLiE9kZDpyuk9PnN/StrCf4o5Fqhx/x3V9+w4ptS9mW33h56bIgwFU4BEXLBhoBBUY1AIuMooigU1fO2lMl1I+0po9akaxtgchm+IFoaDuaGGAS4am3ydS5N14DUGjECdsYU5m4YoJZQILqaeHdelUo6DaF983+x/LzkYEfi4ZzZsDY7x4/grWZBo8JvAR6xcmoT2p3SyFIsOo5dPW7q1aVgyNdOfVjQDfDtcyCBZdghu4KgQV5xZg96A2tfZJzwWOGc6lsDqk/biYPl30a93YMlFBVvXv81QvkUjeCwiThxEPBAJUkga6596ofwwG8+CKuFN8URPzhwB3mpy9napWjAvSgK2Vyq7/KCAXbRUY77YolpL87jEwNbguOyxfiCsWeEhs6mIDELFQgBeTmsSVK8SzqoaODVv6HkAgIiiB+ICeGym3jM1fWLWwKV+A6x84eFZtIXSjoNs/uHG1cHd1X/OWNTaCqRCX3rhGdYgBIFioRo7waSliNgo2nqB7m3eS8cWbie97pjYv5WPkVJ1r6M2kbyIhNG7zV4VnClxtKWa8PrUwrQJcYcK8QCBy4JTcl19urqhb2E3ViPmEqed+oDxWoXlS3jeW75tFjiAblmdnErsERsMEHK3miaiOMgFn7ytr1qsZcR9+pMmhkGbn9Vhp3zihEfEDLGUp8YzuC1dEqKpfwKeGwPsDC+LcOVV/8eZS5mtClK0FbHfus5PPHZOJmIbX3ROvBuFm1raC1IgFz82IIGYl1Ah0Y1R9OcQuYPoiT65cOIgOCcKCubt5bnBVCKT2g2/9RAlIiqAAGSv7J+5D5uwIHatuRO/OVFr3d3nRhgDOKPY9VJGfZs9sq/qDB+L17TQiDXRBUPLCopzaN+krsTKHYBdtdc2MQiZN2AqrZBg8aiSUv4ox4/92AiEQEcaPB3tzjNp1xHkQXDBae7dM0CW1DdPvjOAEi8DEIEHB4OgMrgahEHxhT6f/oteAbSLjXgNCRLG/IWOIzLJT7nvEEFkinVlkVvHhXN+Qe0oRy9XAaGB/tqZ6OW+GVf/Amyl1CgOILgh05oPw0Lg2ZZCrSyKQv4Jh0YBVQbe6EHEBTFnVyN9i4LRgo3eeiZpy5J7tPh+Hxtj2fduuVU4fX+btEa6AXUEoMLQbBK6Ck9UjyMgbXV+r9PG9X5HW82/Z5X2RordHcFQQxYRVLvaP7guGlxteRkYIIOwI15hAUs84r0Afbdj6ldN51Jm9+TPGootEwgQwj0Fa4awaZuunlQCF5sVjOD4QW4tNT+DT4ZFlrbJ9PTXAy1R9/IIHGGOi1KDHwRbcVbvvxpwxzPCdccYE1RU1mLuOtUCSJuLtrUNqFOI1Y6tmt8Cak05+ynHVUSmkRUHwFhm5FqrffPGFmJOItIBwoEIQNBBK+7Qh1ls7dsjXuUd2SriYJBJFSCqA8yycaC91SJ2vlus8ykQiTcpJX+57sN12qDw95agNwQGBv61/h7CSNzmg6iYigcYCi6cDHzKUYUHRzE8S7nsUBF2TSCB5YUk3Ddm0PrjMwGM/CA1NUSAuDqEtZFkugGuX3e81eccO9ov5gLoCIW96+PFacc1Z+MIVJh7LUmam3jf490DT45Me3UyQIRu3OAjdr7AgQoggxWrSmHZFcK6GD6sVYA16s2/LZemErpB1YRZEcTq9+3+DHEQWq+jRyp//kTSQ5Dsgg9ldGQSlXG3uoSXb/nM6vU+DQwRjgl0DmRHAIj0LmFrAcMGjFXNNupiUt9fnFqITyXd3jgzmWA2BzmBw09e57CAEEzvZISSh5aimeri/glSMAQDmhEvicABX6QbKyx62vT35a81iZm059QTP8QHBta5nUda+EN6zP3fEUPAGFBlsKzIjM/oXgWQ+3tU91MfMaI5yt0QOeC9SFsxY4oNcnZrAS23C7apfZwC/cENhwXREM1JBKt2VUa1cRdOOwY+h9hdqzpbQViswJqZCgtU8EWb9R5QUAVwLlueOQBywupinQYsMw+lN/r9/tTnwE095G1mNzn/uFnITFOUNq+IyvFBDFNHHO90DjE6jSdrgEV19woM/v7u1GpHvllCgQw3YGsVmCBXmy3J9E0SA9IM9ixVUNtqSmSUkqsOC8wiTf3qxqqbfl3kwVfm5FcpL0g5c4AdvBxIxvjc4zpPnNErzRmuJ2h1H/p2VSy8D0gJ0wX1j8FetIOAZRXNMp17/N4hgd7vjYpswA6NVFmeo3anHrB3PHQ4ir62yGtgh7HuUsqNEwnWT3WROoZi079ZHkdePr13pa2W169xnxpZjx52++hWwTAB81SQccd0WaM2UFTGXlE+84m2sIGSFyy8EJ99I6PHfpkG8ZmmfoKJjz73LVPzFJU7llP/vugTYDCuiAnXnNQw5w3PUEBb2EcF2bmrjsEJWTqNe60vWbjrgdlJKDiFKLfegeN974bxCLM71et9jeXeEAuDoWF28733sSX8NrRvj481r1WtL3eV/f6ZORKNovYVn6cwtsxO83atSbSRaChj3lkFxr/1n+tXxdSvULO7L8trksKz35EdSZac6HfKTyWTPvbrv5vWJHBh6XbYggAgKuyaT1UiF9AMTOzUp4suzWuVt8IvfsHf/1gVrkgC5ijIpb6/2PZFZtengIgmFRYrERfm5jVSpSPKXO/M6hOkYTVMmv9gq03KpyVtkRii8ed8iYYwO0oF1JIcw0AZgNRWosgh2lHWkFssy2pUVx5v8qjZpdFDACpjrgM2nzexGWgXjDCMugTQsGitdDIhn8RP85GURljKclh0XTedfpefSpbuSFLjeznHFDsSOMLmAuBfncx+3Ar5oy13YN8rcBSD1BggDGeba0pizo8VMWX75xVdBiSpnOrfYd09ZfSMcN8vGJV7IsALuCJpqvxos3YXtxhgzq2khusgx5x9kAVHgtgMF8naEEGYl60Z84iAt49DlZmrHXQYIIUJW+o/Uz++2twrTaZthDGGtJpzMwJiu4qZbnHYBgGYLkW7QU00y8ODF+DfSCLy6vDG+YSOz1DlonNKHNV6T6qAeHuRbA5xyRgETHEGGAEywPMZXapLxdm2TwoHejBaeipMv0/22QxBtmZmpRF65uaBN1bTFviGQ3/G04fEPq+dqFd2GKJ9qMLbdPf7jrZFH4jRUn3HcJjrS3mYr7ruUzy3Sb0SzKJxFkIAzQEuATrR1eee3IxWsOo08AWnBEkNeYoQdRJRjGwzHPjaDQtHKunOLg4F4MEgVyKcxIRaNPBAnx/tW35rmQA4iKl5EBfJA5NkRa/ZiTcLCZ/9woRIE3nV2mbuGCZ/G8PKrLt/MRvQTfKKMB0w1GP5kHLAVdTx6xQe/WJywMhjZNoJgdLZ3hNNopNZbqv130kOCfmrcPVAg6oSkCGzYvmsWvbypHqi+3vL5wTKuQgiQD3Mb+HKaCQsbOnb58R909Sl8jSnvG91M1IxZBH9JprWq0E1E5o65ispu+eGByaWNGnoWU46xRDef/M1BCHEIyAnqBhFP6WNKlpZqkSxYaBsonpH8+vrnP5Jt9DeJwfZoXetgq9aeRtdcdtPjHDEtKcfmQu6EzHBu+Oeh9uri9iKzuICmoF2CBYYD3U5YuSMHMCHw4+TARsE6rT0OMctZy0668fBM4icbEJfWGFLi6VY4CJUbtEJgODAZYRvKfP1g95z5q1MBI4yuDSzhrsmncTYEFG/Sbf6x1zaFc9rR7o5rbP4xDiKqXbjpBqui57ZG9T8enNq7cdn8P4BgIffFrFiTntFqpa/ZfvjGc18AJHl68n0rmHbcWVMht3T7eGR4M1AHBss8tmzpzmdfzz0WHET8dKytZh8kmZU6WpOPf/lJL1Nz6ZN3ltDXwLWCZoGww7ae3N3Quu+CvYfPZSZn57zeuaRDmNYfxFkX0W/ZCQemwMeQsdsKKCG/TO/WNHjeWQ306OHkhC4NY6IKRHeaMGl49+pVChtYrT87M+sbM/wdUF9q/9e/5g7BEcAtnIJrOEsonFwG7NwKlcpGGI066ji5Unw2DzgQPRe2+EL6Pv/+8Ze/fpvnot13F1j8m1Bonnydcfx3WITVjaKVdIJh+lUeoN2jSzWbuWHjxiVT34lINhR3AXnW8BPnjukhK6mc2dJjHoLJ/Y4RBbm86PTwPGcsGBHddNhLkOpX4WQtMgqCUn/ksqnHrFRpglGWuRwivX0CFl+NLOFMlffAmaWZZ4zlf9mRmEUA6C5M+JaOEUEERKwwSUOUX2NGGpJMyMkixEUiTAAwECFXgDONTGwedYZ1ljW4e9Xok/Dn02Tqy/45iSt2v3FgTERqjgho3gn7rkDEtM+5ac92n/gqYqUJJYIBbHcvXL146PLJQ3NiPRWR97yNR8Emo/vO2LXpwl9TlnSv2ukGOEQRodQM5JDtQa4woo4EbOPAi4TD22Y2HXLKIWKqnPSqXz9OD27bunHbVp1H96kkLWKel2mzR+O6EUULN6pSIMRarNoNLBACadvuv3/09O31tyADNIfVbB37x/WqERke/Z/91LHFQPLJfLSoWdHCtcv5+XmaQ2ODdUxepwxeejerr8XIu1mC7oEAwrNZzfr0HjxyQv9dSNafLT6EDVkV1bXjZR0qBus5nqu55R4CsInpF7YOKWzieDejWa+jDnLN5IFK71vR2ykU8kzgu/SLf0+vFm319wuKjau7Lpn6ymJxwEP5OYa/6ntTCwVaI/q9ubpzzv7GBYOMitJlnnlifV5HDcz1zQZVCg72dNKBMwYFFpnznIjEnp4jEiL3Fl0pjD92lc/iGMtHexs8aakiD1fuBsbdTDVW3ujV+T58f3Hp4TdRvpMxURYrRYSQCH9HOcmkRKw8/8+ecCzHKhHAfeyBoZMStv8BuZnU19xEIEAIHSg4RADHl50xSoxVKjKbz/hXJ0VLFmvZpF2L6ys2YueFTUh3fM2ihjN2nJNtf7Z1dJzeNaXyGQjxMPgWCvMrX3bAvT/3rNn267hbm3baARNIe/36wZK4IKvEY/NFShcc7a43Ghh9TL1We5+m5mYk7k0YWMfdySryQYZVmOuiqKQLLN6s/9wt3WNjonzd8lP/C0jqzmQU1HNMSBWW4fNzf0iJ5aiJIzZ/95+e8n3q//7j//4jfwMGAFZQOCBGMQAAcJwAnQEqQAHVAD5RIo1Eo6IhFdwVADgFBLE3cLn4f1AOr3DAhxpJ+L/uf6p/LL5RdrvYHlA82/7T/Bfjt8s/+B/1vYx+p/+R7gf6n/7H++f4v4Bf9D1c/23/e+ob+hf3v/nf6b9//l8/3/69e6L+x/5v8lfkC/nf+B/9nYVf5T/zewP/Qv9f/7fXZ/cn4P/67/xv26+BX+g/4j/5+wB/+PUA/9nWr9Ef4B+G/6jeNH98/GH9fPUv8Y+a/zv9p/zH/U/xn/h96zB36X/LeZ38t/DP7//Aegfev8Q/9v/C+wL+S/03/cf3X1Tfp+zx2//P+gd7f/af+H/iPym9QzVN8Q/8T7mfsC/oP9Z/3vsR/w/DR859gX+i/2v/ef5X8pPpg/wf/h/qfRh+j/6f/y/6X4Cf5h/Yv+D/g/yo+dD2Zfuv7HH6rffaddbrdbrdbrdbrdbrdbiU8R+0rUYjA9sXnsW6R2cFOc5BtD5w3Z3N03TOmOHvXIRzu/f2sZAZ9RoRf2tAUlLsgCdt222m51AlydTkb9NHi4qqRsRwTsvFIZW5wriiyVXiyv6beukttVkfYn49U95d8oiETAyQUBZSanXZqOndCShWx18flz6Z69I8H0J+lWn7bRu8PSApGIU3DHXoK0qON8Krm0vl2HDJuUfU5F9TO5agW6vMY71AUHFaaQL7VPo+Ii0cA7/zt8icKtBORoaO4ssktNf+WXJ/GukTghAH2tivX5LuuKNXfqpbT7j6XgYNjYxLz/1ZZlS5o4l0eMlyr46JuWV6ljqZx0ztOL4/HxD7VNVyhmTauy+gOApf83BLvRB3x7P0jZ5lXOm/WZFH/eVtoqRUcEge6gaKbQiXza7Fwa5w+ua60n5p6ddkhnT5EJx9Po4Z9gZgKx3KMqxwUAcLkdscH0yDZQ37iiKtZKwbfnf3babS6DdFZ2rVXqe/YbP7AlPD8LYGAqQKZbL+Z5mBKH/naUfJUXZCv8szTzaN8yeeKy+8aqRFAeza7pJAO2twzABQW04hjUH3XJKS0Bn66/3+zprPtpJOpaZKsnycVAo1EZj8fPuOfblKFPvrGs2qn36fW7+k1YSht1daj2NcXrPoJ9Ve7XolDAoWq3kY8MQgyKPC7EdiRyrtDpnKSgYo88VNVMlNbc362c/U+3/IxIBG0m8KTJtZHTa+TFYq6VXIVMJ58DBSgERqJqP6IlrEB6bn0orGjtcPY0lVI27/p0uj6DEN73ScalexYKD/EaOtOilZe6yi4cfgS5+l/lu7tmp6rSInWyCgLgmfEfQx5FeDz87KvlisVibqlHDQKn02pbYG0oPSf6P+UnxrJXFAl8HpFVCFAMAVvXSooG1eomc1peKN/BNsYFOHSbZWJiTCz5Ru0ppopgR++alue2stp1Bpl/aY2BKh34/vkyuTqdTktrDkniXakzSCVF1ftxa9/FincB1nsgBl/zPxXZsGqtLoOviH4e0vk5PLtFefrsWo6dtVx0do0m0G78jbXgTZCG2UstpNAj+fz+d/dIVZZpduk/OptcF2n2EFFf/31szJ8Diu2xeW9BZpzzkgxmBeeJ5rYpbb96mM7Xe1KgnsCuR+Px+PxmTLY2rByTU2EeXelv/s/vyRVz/Xsy35gXexkl5NVd2z9fr9fr9fr9euGxWKxWKxWKxWKxWKxWKxWHgAAP7/zfoADY9ABD0YN+bm+9+bhJXgEf6j8aGYkCAajI1uz55v+oztEivIAMVjsqD/MPza5PaG2QgEMH26UPLWf1kUP5FqQxHzw72KcGdG+FcdHVzJsHHVhEvjRf+Z+vCdoFhIxBjXtliYyGbqzCDAo9DgHb8fNigejDD71BsqF9gAB86z/OZoit+JZlgXvzQtsQ/i28tqS/TdPLjZ87DgbaZIEfki0oumXKQ1NpY1iBEnQj3+RTSeeD7yuxeD0SvLOy5Hsy8KmO78piDGrBGZ7jBZTeQpVcLQ9ncDjIqmZNfI/4bZIC+6Z+C6Um4fhFPkr94HJrAWKyTxB7hrafn/WzGzV8kAbIuV6bIV1F6haCo5U9/BW3wIUV/HNahgMqCJHDk2bD6E1Qikl4/RJQT5QSxgBdjiW/amyI84jmOx66oPS5g8DQ8jvvITCT8L1KBrYxx8T3isQcQ+F9dsj38J//kVvhSFwpP/HjWkhozoKJHGlTo45IoWmbvAfL6QNm7+bnzabQrbMk2n24jJdmMvbvTsmxWGWJhw7Ic34G5BAyX2dttiT2G47zUktQwusB88gZsqPhvtAuecQtUw9DX47+o9EQHlAaIufmIaJYxt7gmjkP5yZ1W6JndwBSGWewi/juGr7caAPux27EAKkueCMwLhzVxW4bduTYlEzMjnUsVKSgOt2SPvsn6ZH8SxFCCWuDUB/PBuiBV9bvJvyS4WNrNyeh0LZ22JTfATPsbS+/hcs78pMpVfScL174Y1V+ZtfmFTyKj2ifc/oSDUXCS+u2itA+k9Ofely6YewO5B/vbdI7zqeolkJzGSkUUCYc5GL5Ss+9TR/PZ8KRQIks/apRu3B0VTdp3yPA5/cOQ/Bfzrzed/nGLnPNYQxzzyX9ctcjqJHqspp1VHpkzLfOIdzHvY2Q37kP4wqfK/x0ofqnX83f1J/2OLjSCkNP9IX/waKzBJ9p6q6smxF0gpVLa/he1/A1O/MMDZrUeYTXmefygyIg/xVOVclziolG6sdaIuQAdEw83W18lsx0hzmtH5xZqXJISDADaPgmXeGdUQZqzpRy1v5woNVzyj3PrL/LhX9PhfpuAchRYSJoROeDjXZ2p8p1kAdlqS8lv+byytPv7//bBvo4ReJ4UsdHTEJrm2b7PhgEkVVnR7Eu+6nMHMeid/w9LiqpUuOCoMJxjpyWIoeyZAyjAMQUBjdCZpw1Gnp7ZgsQbpW6tMcOwCsczm3z8DGMHFZgiIm+p/P9PzJ4IIe9I0lyBpA36OAzO5uC4xdRzXo/VJoJ6uRlHyzhF0AvebIJOlNjkqxy9hWh6W4j+FIMgzuCxTvwki+/Hfyr11jzfM1I5CzfyEyh6D8g5mh2RyXUd0vZoBsvfsVO1RUTn/P5ZwcmuHPqKz7sdQ/I46eRv7zO/Jk5j9rufKcFcteveK8lhgyovsH8cisnGbVAcdHKhng3Xl4MSjXYALWQdIVcZhOEoFg02n8iGm2itTPVh0JFVTOQh5KUVehZ/C0FFBV7TLYJZgpCjtz2CJAZ4etXd00RFED9sY09O7qv0a+skFtMrDWVYw0QWY6ITd1Wq8KzTJudLN+mLjhy4+wQr4096E9jrJEZeefL3DUdVZ5NhGLpRqbZ4ypbQjg1btMZgMwxRLOQhJmrBLRWX3aj2aGQ6nQzmS+IF/3ruIB9rcsDgljTe3TagiKRdpBEPKqhsKmYrfQMCBNOcTkDKmnlwXUMN6aG+HV6wPMCABUM/8rZOa+BHERB9BXz/3ih+aeiHnLS76WzkzwbX65TojnmJB32z6wPwr75iHvOcMT8VZbisFUOen6YqV2N1b5aZS5WqTEBWiE9HGOcjYMuedU6y7Ux/3XFMlFhDByW3ybpEaH8jMpWg1jXEICRD4B0IaqnHsma3kk1lAQg5lA2+/GkWH/k8jQuBIeOSWvp+vd5SXDypRlTKULL2wvQKiz/J1uPNadTyJIsirTIhgIu6CEDQZYImBMS5VkboNw+rvNEm5NgCUdSbX9N8ELNSFFFCfvMWLcD3iPRl1W62CuGhXF2xejvcDR55JFUwrFJakMTIdjMQ6/Cg8zQ8rk5kRRbj3cmUfnz59gUHYTfcevpBhhOi0GjsJjf+5dU7UyUVzQRZsY/rB/BBz+zYDu6gKIH7/Ud1OLP1TxlMhs5emYHI7ezDb35Y8N1baFqjLRYbHt0msXk/7CF4nrK3G4WxaG96jf9JS9eeP30XhCCZQuTcSR0d16Fa5hLAQEL/pa26P3d6N0+/Jc6Kz80DDEyZ/funWLPaGM0Di2RPRUXGEObsTGgAdi87zmjs6xCv6XyFhQaYVHVQaRUAzlZFnplWdQak8ZyCC2BvWpOjlCLvdPFRz/Glk6C7DHAmLJ+kFieieRt74lhsZXt/BG4U2HkUVEtKWvqryq2pyjcsa0Sn1Ugddp6WvDhLof5a+x5NYSYlU4V6Hdh2D3oc3nynsJMg3Xi899d8klr86Lok7ip1AGEvQbSvLw5In+cWeo/fHbEeRZAlaN6u1YwOlvx9IrDEQHEuDprVjetEPXaE3+zUNNoPGafjtt/gxt0uBzhKxH21MdwFgdKYU7/1sOTuIeWlDn3bly/qBeBMw+VkHctbzTzAExkata/+9IIrDPIbJUYgCDy03LObtWbx53mHxRhsvcg3POyVZXqDt77ulnO/XtXbzr4CrGSeRExJFGW9QhV1RnQicd2ElAas7oM5ee4LCCj4Luk3doXhcLlJQEKm/MO/ec7plpee6pBojUtX6Ov08agxGpH5wiSjvcNh9i/c3/zDTBtmafB0m4FDJRUxupHhIOJwlsSTLk+1GDGYnq9dBsjHcU5UblyoUd5ejX/38O22bPVBfM2B9DEIGCABbT0+/4sQ50RtU7v0oeE69tjASYuGd6sSPisRKw6/ctI5qSH/2mxF3tJs8kX+pMpEavjpcISnxgDP2XHzSyZvvUJnx6yBvPFXSHlhXa2NVMoAeMdH7ckUYSMGZ7Xu4oUmV2z5NEuxvIId4VGoV4wmoxiD6EWIN9s/PLI/TGoOAEyfm30kcC7oblUBrOqLRxL2TfEiHywNUvwLW8upU0BAjuuX+HWOz5JqAe4DisjvmP5mF3yMZZXS861d/Qa+SL8GTUvDUHm9SjkNi3y7YjI+zFjYAWs1f67taFbixi799m7bi9ql0Ise3/o1TJL46qX3nvQMcybJ6xHN/l+/1hLGQRR4154AuOCDmYVDXBzMuWhZYUQaDu+vS2dW/iTBZqXt9Ab/KPbnA7B+laYzrwKuHP6VkeaqzgQDEfCTSgm+PO0lWckKrGQQFzdzpZC3/vi37cfW0rhrsx8oeC5USIHbY6DLeDg9WfA517IATOqLpXAsMgVswLix6MKCCVlnXSi8f9OcxUuxA69LSB40JEJwTsdmpsiP+WoRz9Rhhfc8uex/nfW2OIdu/3jllNjGWjtrJU9XGZzT+kkf9mNj9NK8C8nR/qDtRp/49RoA/tpARpt+rFULIa/Ld7C5ppF72zC///uyIon/wAWnm2D/kPXu3TmbHr1RtK+C2DqjCaK0JktoP2i9XAXYaMNDY25co+5td1yomIwMLBguTL8UFG2qKS7WSmcST5DmuTYzmzmhtyBnpX14zAdciqhtA2/8QXjj5No699vi1moODD5cjHoBJviA1O8JrDEsUDqX/WMPvaoQ5aQnU9MSLTjMvYT1FKtf8+kVXrHSyNqsiW4H0rfi7r+Kw05py+9dpWlo82zKBT6Om8dHo8j6upjgb8QMQCBB3ArRYHiCM9OHKggvPMO7/shw08t6TgdGtkaKf19u9bGZwzapylQyBtOWW2Kevt7B6giLKQnjd3aewh3deArVAP6ft/Fg9xPJwL5GSL5oQWx5SbnhfGUfpfUfg8Q35puOaPRhhciHoliMD65bCyS43tOYIqaLQPV5dL8sHQR5IBm6P3g8bBHMVOQggY+iEm/c5wdSHaWustHwPMUp+OlBlzjY/YKlMPnCFvQTGy/k9q3FNaUvbi+Frg0uo6mezFjONL/RgOYhxYJPyYXjC1t7nc8Jxj4y2yQpMhtYDKIE6qU7vnSVzlMYPh9JrXOazz9MhHtQrPfiL6Rgc3lZTWElcPoA5x+f4sgHvnrxLvZqi0f5P4s6/jpeW42Bg+ADm8h1i4YkXp/F90D9Z300fZPuw95RAL6he7TcKOVEPQxWStRYBbNg//TmkSIrpRkwa+cBIpNqzGaQDNEt1b8GQiT0sxPHVWbV3cKV4AR1f9zaCLTXL21g1pX9Y6fRyjc1Vp5Ou5eLGZeBOM0Fx5S7kCyK0JU1kaKDuEZ4oPWaJc0ocNlprP2rOVFsi0D+fVJp1ueYnby55reFWhzVun5dyHZzrFis7/5W8XQCY1VX4PDUZ9IQKcikkWnW97e61YkdTr3ENDvBWQ5/dPaowNyr1sG/8wwFXTbcw4qI+5E3i6oU8Xk1vJfpiuXhRb0wls8qbzZJRnEx8f9zpFmyJ5Ucery3jyigtFeFcfGIuxxnA0y5d5A5jUiNqdnGBXNOciqnMxwT+OdlGVuR0d0wvhWiZIY529up7VBh9o8XlmU1qHCy+DMilwD/BFjNpD63bwakxqhXL8igff81C/al9oKMQr6nxN6CFdGkkE1LqQtGDa6vkUuQh8rocH7oTN+K/U6kCNMDFj4WrTE4jQpmqhXiAHzbFFGIbtJq/rscUTzGzMsNmRbUmP/d5nw/qRh13zQUF4dmy0IgCB9kApNBSBs2bTwNkAmpDJLPfT/7NpRbUFSPP+ht4JWRWc6p1wv5KnOBv559BCm+OCi74upsDT3631zpUzSZUy48YlWZEvv5ut8vJAaGRO23448l6LF/M6vo6UI7o1rU/NU/JgOHvhBQ8Ra1rc7s/WfFfmUqzdkJqiZ6t5+XCbQ6eBhP/pmbvyhnz+PCpA3G+dZ0RsLt0QAU/j/kpfGShBMafj5d2kGKlf2yF5UQzMy1Xj87mUnF3OtYgqV8iEFHy+jywY+LiWb4+U5K24NO5yWZQL+94Q6vfRiWRSNCM+YK+9E/jrOLh3d3pqiu1t98cc8jEX0AhA59E+RCVspdcTmv/ZxrtKi/NfDUaefZ6whIvAHb+w/druZnjNobCyYXtR51aKF3DWUKAT/dHr2zoixzay3r2ymPVcPP9cFc+kFzwlsCxGwK55n5XQynbQdiKCEswo9ss9RM670nVwBuL77hDnZT4HMHAi8JQ+fmf0JNYfQRBHk1wpiTn2X1BftXgc9Nn+2Ql/hWyj2AeXofrgDieBfb1f4u0mKAzkKTs0cYm4FyPOQb24ixil6X5qBat0wV3jX4PAXWMccYQLgsse8Jem/gEjL0DX85LrOmPUnICh1n2qrH8MTusCpMPSMSz8W2FPP8oAp1XsUGkZljuWA/35SGmEjuLPHGAuBdNiGcgdcf6W8LstvydCAKGPEDgnmyPFmS99RqLCCiot+Aqy6MO3MuUDtS8OefuHRDXHwwwLjTyBQfZWxESpAcxDegaRXhixQTpDrDHzyU48j6wdjbZUWianL1gPkgEkv5Bt4QGfprQP0rQCTMlWJUhrguf03ZQqXm0ItuN87d5+Sbg+q3Siyvg1d+eAAhACiYfEG2ZGh/g90UCWc/H3uz6row4RZgDlfeT/fWDFXnyohO8TiI9NxvxWhQCbDK776CfvKLVB0GqnV6DbWzbfbVp4Udp/tgzKx/kdKLXUhreQo3WoifYnOaQ5FXy4LTGXY1D8xGWYu6cYh7g3dQts+xld4rcy8/to6QfNfSc97uUVaIIApsJ0SoyEAAQtXZnCmpoW7lQp+B9oi/npt3Xp9Jyahy7lmslqyWMefXd5YQ+HH9/im+x/xId+wYb3bZgSSYkayB5kMDOZo8arlzqykbmPDF4bPGcL2a32I94RrrRTt0DUL3TojcSDhYkzM89/6Sk/SMneY2n13Uu6Cw7uTuCnMeL8Fwfx8gsy/3CN1nC3yh/6Xgzpcx3/Wv0UF7SnlIakydaZ9oDmr3iu6ZYGseRGiIopyt1BuHLKWJkt8SRLPsHKQSI4PCCHav58PpN92sG8HQI1fce2IOv32t3ssMYJj/ieLCu+E99M66UU0ps2QLO8sTyAvMM2dMmtr8AOj5p0mbofUB7XbCMxTA+TSc3MW24LzcgzuBnRTIpJl6dYf+hkAcA8J2/0sB8ZDV8b2v1zwgcLeRPT8GcLzllBiLCPmQ2BlfoT1TPeIg3KMWa3PhEcW7zG/zjb4rtRpI0tPS+FMLN6Ed8HLZ5N0ppxLj3/nqrvGw6HphKX9dDHFduOob6r+7QN79KXyVaZRo1hhdxWCHkk7Xg9r004xt7TsJyFkR3Hana8n/Up0HrZg86dkubeWyjSH8scLU4i8NFN07oxtk/6jdLl6x6AdR7PXdhD2MBxVAKncXmdlTYxhat2s43yTZxymc3dkA/zVEUPbPuu0mDtCLtR/R2oSUnEYFBgMXP5lvSEozuhs9Nk9fTpZ30G9ODyRS6FYMpDk39+cTn2VEYkAH7b646zfNF/12uVW0leP9iobSAvJDr+Y8UnXsKzCogURTWN/TnXCZP2GiRC7jgqpGrFN20aLB0NQxGdTj+l+D0KNmIT7cq/8Ko8YFqqdMVmve6SnmfJEvcPFICNaFd2wj3M1JFTK9U4h+f2hWVt6YcO+sW8Y4i870XWl4G1YotcUJrEQUqYWfu3w+25ADfpXgm8wc7bulJdM8NvyjdOv4dySOs5Qrlkq+jltmj7W9bnLErRadt6WNy5sgzNCjvZOPXu+txrxn+thHv3lTzZ7xOrPaniFpMBZyRWCdMobqC2Wud+oGBT2RA3kMka1ingfKG9aItXosUaRI/VXrTZUsxkyJx+ZZYZf2FYVs38cQNDdlgkuXNX/vuZfwU+UkmjWABDTU/qmzspCCFBcFJ5msvBw6FGaAU2NqcQoIgsYRqX+qioR1L5Enlv8f8ezSicyEwpu3SHLkV0SQVAjECCkmes7f+aj+UmzU4/cdJYZz3O4MPKBbXipR/GxizlAmVFVFSLJrOThUfKOJ09hbGvT6Vz5wtocVl8IoQW6z+mHB4lFJfC62dTiuW0sv6dE1Ixrh/SGNxyy9ZgesLmKnF0EsAewRPrkMlYU6ZcTRXhh565IjYIznbwcWQLr3yWkyYgja5kX9KksqkqXW5EBldU7fXPEdkSwWfWFPthC3OIYbFHI/lWE9tk3mCVTuFR3vfAc4a/xfxxAbSyL2aK6rLghccQ7m/fQkMUKKpf1kFEJcw96QdG9BEF9ljneikK8P7VtfebxSLwziuNqY8zrFfxsjtC6R7lBIUMFEyHqsCT5mb5/5z9pA8jw0O+YTqxmmAzDuRTpHmgRobdisyGR57Sd00fzY0bIEa+tyH7hiRoTJSaC7JbDJGwh4OPFYwqZ7q0owfx5tuOe2fBCU618ZFWKPEAnDnLpxm/PiGAts3BuP2wXUyUnQOAh4asaSCE2M2ds773NWQ4FCGyRwHBTwttKO9g5w+1VhfBa2ygPiOiDN8kFEHYYBoqGAf2NnGNnQglnPDdGCP8srJPo03Nx9aoX8gN/8fCpPb6p8gGnT5WAUf4eMgReof2mYzmSdymN49V5FdEZsCu57WsPMLUSM9WTyFYwgFE/yjzB9kmDvjGLLmXpU0rr0SxObuM2AjrXNTqN9Nf/tmby3x1lO//v1CF77TLlbaiyVfsUOwELJb/dwExL5vy5Ju+k4+EyQazqVm2BVSwDxCjuIiF0Z9ZLHNqQHtPVclAgz/VOPQguk2WYTpq7FZjFbfmDp3LVmAAVNqA23pdsN1Q0VfqXrQlNu+PbExDM56/voLuTVGRWDRCA3KxvqwN88IKZvh+d8SJCrt2ae7xuATKTFDzSMumCZVs5K4LYlQqpDjSogWGenHs4eZ4nF11cJ2+RUnAx5xtrbd4hx/vCtUQIdCtIaPuxUct5tEm2Y91fce34eCZaorB8zbhz3mDeLZldTQCuaAjaXGEPsbGqrT4pq+XvBnwXx+GOQUXRY/99PshZzqO8XLAmzZyT+RhyJRw4c49+Ep8qdpaQhqafqw0w/LxMf/otrSiJ8uDfk1H2BM+Ac8u/iYwFI0zqGNRA0jXIodHFo6kwb6fEJdTQn78PVcQTh6mfovC+ROznMNAYVp1ot9b6yhzBxhNSkI5iZUMUhQY3fUgaM+YreP8rFj7egx8I5zJuu7cH/3pEC9UloNsTQF3v9hi0xMFIq2p5MXaSwnQvvxL6OilbsE+mEFTIqDvpOBdaAheeBzuvkCzm4R3hoQOCbyj4pLxThDaxJmjreSSaJPxv5/WE0Q6+7BynKMx69Eyoxo4rUy60oIhuw1MBcsFEJYcSBWyZsj4uoSE9vmkUyGydD2+trVbQbqMfsiqhwoiWch6onbQuALctC9m8H8PEjaZbV9G86LWebUZ9Abx3ex1bNmm2QQa3MA7eEMZMQ+seoy1FzXA/gombo0SdQTz1MaaZWiIHpyDD+kjCt5/KiJm+5kitiAvI23dMfsqlME2dMLP18rB2PAb/0bnMvPAOTieMWRbvWGO4WceTIRRsjk2z2wGkphyxN+XCN7anVvL2qyvkxKOEEKUzhHZfGmhHRe6tEen+c3FTllUZoaxPK70wmQDx4WNtVyR4KVGyFSmDmQah5HP3npu49xp+0hG5YPrnuAzZWeJd5zrPpPWAOEVWS660ZVzhJbb49kUvGj80cjSanlKO/dMEyBdkw62pw90L7hoDE0+s1OIxW1cLfkKIr982icVg4AzzSa/oEXvm1xMdrNzfv/E8c2xaf8+BPJEwR/M+bk2uDtfokADby3hhwi5lWFeJlx2babEx2wiZKk/dev0YCuSP8F0FoIaK8B8pWyfOG2irdTHV4uRR0xmzuDAFNrkNaECW0GS8bj6heurkG48FkWTY/ejdcW7PXA4xUc0Y7j2i6tT2eXSu/1CLl3JVAsrKc3wrIV+nX2M8pJC4l0/Rta8SGX1NrxFQpk34EUvAfIZr7EenVs0NTA+fZN37cFXQ21Qgdvi5c91AA8S16/r+ShSR53/tzINBuQVwIdfzydrYnyGx20M0/hpJbOJEB3KoWFJEd2KxSakrf03gJ666n57S0V0Ozp6P7aQvY7rKnkIuIu2l/WQTBEtKVH3zJTcWuHnUtZpPjNYFW0id/eEx2dNiWIMucaPymmZuqDhJvdxwljR89IVQOBsHBKtMzHjj3qJb1s01ZRMuL3UzWPbP+x/VolAr+htZYJq/GFPKabxsC5WVzjOpNKSdVyGGbXU3o4RqmmC2A8hFVtPMo23SyDOOrKGYMmp3Ok4ghWWAI/v0k/qRbWwv9zCgkP7WGbqKx7jlfzGIqA31d/Fq+fXW5bpMc09P6XcUzwU9lCW4K17oRHAvNek49OKYSsW0FN8OES5Li6UAMRf4fAPX06ThhycmkxxSPDQ/8yE9gCIzSvASXjrHtAYnRib+ijD76YuPCAA376sy9jbPIKIOIWIgh6U+Yu4N5PL+etHkwaO5VRjHX6oJNRVfkSaghEo+QOwdThTlZcZbhmT32s27zRnSqKDB4OC82GiiwaekpYeaHMr4P6NiemDl1AvX5zvguMrBxZzpoE304wJDKCcV2yb+vduXoUtlE1U2Nq+ED1pUdc99rHnZujUVCg9t+uosSVDINRjxd/GvQBpOF0KcV7uJVuIf3K+ZmBbAx+QebYr1N9HD5DYRpUj2g4lyvWKPwPCpRMHZTgro2ph1quRapEfAeiY0dNr+vS/C92rnWljjK1NVBm28XP5hdpYcs9FNy7+7xm0cuthV0kOEJ6HM+XAqcxQXMicdArBlEGnAq0s0drVgZMAU2fs38w1aJqvuNE7kI5J8moda7KopPkGWTPsXhJV1Gl7Y2Cu8FCP45jR+D1XcYMba+0qbBnvzBw2ZTax7N17cXi9LoT+MfUb6bTPV4CKWJ+G0q9nwEL317kJfnzhbBplOeyBEQubYECNSmjCG9tKLG/uq0wjEl7GdCrpCkZwqrcJ2srnFYMAITgreqnrUjIUdmsNzY5FoGoOI2qSLP8YbFjcBx6UShZnTLlNKBBa79t3vX1BCN99ZsiVIGpwPGdQG/hHDr8JI7jBtPINiFSQ+mxlU00pIZ7xQD+kEF4LRllHMyaSM/O1PnbuErABsotMXJAQ+QXDvncPMqaN4E3akgkuhCY0PKS5KCD4WeGE3ABUbHfG3CB2tLDABw0Gvp+ROsjJeHQ56OA/8S16tXaBV+s5HXG6JBu51Dk4ceXADg7MJBiATfjd/OMsQIsZ1hoIhFNzed0J4bTOmJXAcZFoTJdQ0ZFK3eB/p8fzX+CUaWkbIBLkhWEeeqNtGRXtfxj1n6xJU1qMD87czPcUcC+5HoAYFWmQn/v5Uqlomx//ollvMLEEV13t93ere9khGlaEhmBZETOMebTISdcbDLQ4VXwPeBPcnc/tTEUPKasuYkLt75KdrnXYjZe8+1SkS2H5nKHHYi9yxc2P7FN4q6MfYytP1DrYJmzFNalKWX6mEh8FsU5wWE6z7Vxc118HlUb4bPEid8ThWD9tfhorRaYIdpb1Ga2Z7O94bl/bYKirgwZ9lArxnrfXVIDcj3+c0az4aC9OH8DdSCVgFw+WbwMT9KlsOB1Zt5vgv95M/SZWHNwRlVoitcBlnzIBhZbxnC7js10T/Dtzl8inpf/Y82lsC3tv4SI1dfzW0ZHzo5zq2yqmpjWbvhkwEgb1fe6kekgl+vJF5KjnR7FK3qvvGAa/99pmKDZDx5eMe21cbKr++8+9o4CZQ6O1FsnbplpfTgF/XWW+nbnSLbgtE8SkC9lNtelJtefABkKbqSbTXk7TwxNdMS9aIspzoMrkBMd37WYWfzGdiyyThnwbg8JRJCj/5osv0uREnW7jCsigJDhOe0SAoFvTU42WhC2DrqiiPlxdSyTP4DWerCxIck7HP6qE8dyLmiCkAyxPnij3H1h0qB8zaTU8EkOoahhdaHzGpP2r69n6N/SBkm9GJeJnvgoUAiRPzsYGQfXOFQKE+jBEcwyc1kPxMowDN1D/JJPwlzIk8/5qHK6koVdFbygX5A1I4oF+u1RqRFtGMAvqUOSExOPw+IRpGn2iGSQhh2kSMFazKw97rFblxrDDnpzeHZcDWWMMrXdA/fWNKjOEY26F8PNhlYUv+VhW76pnJKsZEjvQmNcCA24hUrBp/+JRbYB0yJvKFA5KV1jROPj2X/a2Mv7WTihfyyf+nEzPU0+2QJFD/gVxICKiLl9/0Y+E/EffgrUWlJ2gXmtM34anDRoVy+g7Reoa1jORkEE8gkw1gC6QWLa2NZhJfrBA388vOEed4SJZhlmVj8Iq6YVvh/LY7muLFoeMXkt1SMKLU3zOIM4CZ+16XPAP/ysXLfTrJMr/A6ilcv1bdFpcbS/lM1iGNsu9cXsDJXlUqm0alFrpgTYwUgFw3O+5gykfPsClfZ3CpBFzxnGQ8af0S0hYN9aGiyRKgJb0HPX8LKTU/krmtJY8av9flgWRh6P81rmPY2L3eVJjCWWjgi0fFR+ELf7zwgaz54GJDlQcxdsNEGUE4oz9opsk0K07so9mtTZDDoK9juXirhTy3y/yzH4CIwd/wCgu5//fTuuPgzdQS7f794xFheltcAm1QiiV2AC3jxgPVPGB7tQWoYef0BCWj+K2/Wa7w9EactxoEdoJqxXO/XjO6HOMpJpcSAfxv4krvKVp2F5+Io2e1B9aUFa7OJfvwlfHG+GwZSYBrGax1592WAxSfU9WKuiRss8vvlsQmn4bcBgmtQ9c7cM5CRS8mRBEZOd8Z5kQQZiItkBKDamA3eYYnktYFVkuVIjkcMJugHdTjhMqkLqhljq7Hyi9DzSz1mZPoZI31q6QK3rFzzaIMh0QUdqRAewQY04StpDTBVBrN08nyJ+DwgUlH4FwH8/3D7OcTqQKHJj7mIMIDySrR5RPfq5ywveKyng41m5IKdqB2rmzDOkv88HvXcWw891y7E2nR7F+yRmjEFiVa9oA6z1BZ5WZsqvt/5L4KTKXoCJv34jz4ZgPJ+hBIOKkF6g5tz16JOHAYgdFhubWPe5uIHRfHJX2zZ1BpvFgOv/pBvBVCMn7YgIPiZkBzT4EDgvhUi9Hy+J08/YBATiRjfHw1RzhCNoo0qFjtUkpFxr5jGwLP0+Imoknbs28pX8/A6SbjTDv8avG3HlN+FKb9GSKceB+mbBnx4DwkjkmyTIIxyvaZKMjhnNpsHvEGVhFpo4dNde+qtjQxqAfup3A5F1HE1oHUdLl+TSQgygspS3i+CIV6VzmhXA3UwyyVAnS5Jxi1GX6i5N1OG1Dg7RLbsc1m7ofbTYzivQTwymUSzDdSLOSvp1Y9EJkc36JRNojzwDhHvMPlSPOF10B2RZsq8BCQnKi4EqIiZ7n1pzI7Zkss7073tCyaOSfdWiwNiwrY7HWbpY7ymLIU+8pS3vzXX05wOwFrw+bBgkKxFXPJBO7Kz0s22xlBFV2l4GPwXPrLlHIvOFAhikWzPYXNqvLoMRry5/CvsZ1ZidvjOgX9GL0CAAYZswbxgZfLhl2o3B7/oY4BSh7yLUOKjY5GmjLQMPRw76fdFPXeJ5Z2TeiXeRXoA86pi3Ee9a6THaccYI//TguwJQEE5uCZcuQvkkJ2Op6F9bak4B+qlOZj3zdF2SR4HUxWFqpGtC47g2yz8Ht7bd4y8q3+N8WJbwrHU37gzBFkleMh9IdCsHOETqvYmK8Fcf/uRiFzzQUqMD0Mm0tjXi4FpZlwoOMy0VFibZCgZ23USXs5xc0D7STUWBOrzaJpjQe4Eyy7k5BIFyN36v1XjLpohKQ1NFlsMCdq4qxO0SIxtkWRAus5J5RtEDjNukYzLSO/k1x27dRQ+IKZKroWhn+k1xbfSENGtQD1NynPvsWi5SM7bwUv8ympFLTbQ3lshS7Uu3vNc9wx6wCwcbJ/xJwsABWgujfmzJrLui6A69lX+1qun+jI/lu1pmum1AnXG+gO0KsiC1zwAMG3J7z4ly9oVYjf+Y0IxBEQXDXChYEZ8syLQ0/gq+BGpqEhNmMG3JDwd/83rnYRMrnYJU78qLP5xfjSy6gOhDyP4QjwFvEwxgkDaL0h5SvccanKU1yCkS+DKZgIq4eayIS0SbA1Vnnr1REe1+8nyIl/F+btDScq4wROx5M76bt5Ihrp37vnDTq5y0Uu4RW1FV0cey1p1yYzpMFo2/MUKDXEbJdJq2ikZ1spl/3Zm8EsFoUkFN9sroc3lrFwd4h5PPQj+26R894ZDrRNHu/t8yZciQltKg2/GQVhrjJiGdMt0P0EIxA8p5aY0WoXIGgjMGYmDzmPOhWKiJ6c+yom9WC2qZfx0H1Wi8I2t1WJRXklvS2gfJnvErDGEaeLRwx7+2jUux/MYFrpLIFY7q0z6QDIAWTlmwd+ItZ8AmpSM5v9TATVUfhE8DO0ZW1G0C0jJ+3iJ3pNet2WH0mQmJjLOCUaWQ2OlVJ7zheZwN/SW+awVuwtTRe8qxWmfIqCbM1PWJZfZTGBepNXX+DYb4kr+1aG3UQWCJkTsgNI2Cvc32SRE4cypTGtSA1TSNXpYsixJTUwxe1O67Y8kmZjUTDNFepvvRgihzZ0XCQHeZC/OiXzHFoMvaQC9p1NAdU5b3H7q99OFstpKEGS+xmVF6ypEdyxzwzQXGCZ17QeA3xUlH9z2BnqcMK3/AoK/7yORdpE6JJzZq9a7YjWV7j3dMwV7YoAO1ao/POeF3Fa8rkSF7r1ch6j7c2OVhAj/bj3QYGHxMfRE4xQiG893GtwTDBfjQc1I/NXRB887+mx6HciHzOoiJe/BvS1aAvOhyg1IJ5zUixY4wSqYiWewySMFJDBz4DuAzYq2YBM/qnqR+ssMNn9vyuf7K0jrypt3oVL4g/Z2O0UphnZjc8tdjif/2uGUP7+p30ANnk1oRBFhL+et+Dhh/jQLqeN/rpFU4dK9p9I4s+Fy9z5fPSzKvoN1W1apdpGRCbzlVFy73rJxyYHrAIxWJX0lQ0dkjHMz4AncwVOsg2Ypextg9PqEph/v7EwM1X2er7f5bw94iSLc+VFimQ+2e3rfroxjBXaSz+09EHgDcydn72+SoGjbvaGCl84MXp1eeVIJSaOI2QW1pN1eYjJSUI3R/MD70YEWgyLyS2JI2d2pqil5OM+0OHdPXKu/YLy/ip/g8nU7o5arYii9wB8P29QFZZrzYJC4CX1n3DVIjogCmi/PcQGJIbhTm6ZtMUvDuc45uEVsKo3LtmO0s0hkeoMHEXyRu4gnc6s5eSbYDnR9uCwcbw3oNd5uUzQ61zUOsBwhwMmQjpdvUT6IR82ODSQn/WAZfPiyGRSpitDW8bx3/ajf15PKKXDChaVO0ZoMmGNGCeCPmYor4zAtaDQxCTldws9HD1qRjVmmuVskeq+2CwJiRmmbAlamZFvde9zGVOR6ppxdJf0+1SlxGcqFDICcqrCjpBjqZa/p9SIh2zMVlE0wgqGL/PE+p2RkDYU1op4KmWSWHfoAKRjWtHj4oQsSyXWDpy6leusTpKr7kmmU/KzZj//qrbptFkTJkm8szerAuK6Sbmcf+3WHQkfiVxJksTijGiWUJdhqJGLTR7lohnzq9hVEbrTgJ75wYtVfKayruiuQ8pGadfkOTlSx6I+LFTS7AxVuhVl7+hoU0qApGbBWgtln3VJpO6f6NzLdIL8BqcMtnWf9FGwExdy+G0XLoT4TmFZmXaaHy/iFLSJFy3oCTgCgfq6jARthXQ5J3ICF6kIHei7VbMABGJY7ejeKmWUi6nRNJ1/iTa/KVAjY9eDBc1P4jkU8BX5oSDK7knGrvXrXYkAC9V4TlxEV+j8S0o69vQASu5MQR6h41/xRn/x3aQ83KvY1FDt6+2zm7jXzSEW74CGkgorWsjErYTZvzrCVigCoHxCXcMHZ50TCSLxqb6GsW4QgjMB7zgjlTWCeZ/XmKXKNY73CuQRToGYH2b/JrWKioTSyOkY+4X1unHcnTfIBpBFL11jecO6rjGCS2+wO6ZReOQBevCQ5Yj+Hfei01nclM3ka9ovgD+IKR351JZ9atbxUh4ayF31DAo0DBVMPKJYDYPChrMSuZj71L0GKdsB7rTwYOBXsb9V2jvq2UnblLX9VRAD7LV5K6mGgAAA4zAAAAAAA=";

const sheetsService = {
  async list(sheet) {
    const res = await fetch(`${APPS_SCRIPT_URL}?sheet=${encodeURIComponent(sheet)}`);
    if (!res.ok) throw new Error(`Failed to load ${sheet}`);
    const json = await res.json();
    if (json.error) throw new Error(json.error);
    return json.rows || [];
  },
  async append(sheet, data) {
    const res = await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" }, // avoids a CORS preflight
      body: JSON.stringify({ sheet, action: "append", data }),
    });
    return res.json();
  },
  async update(sheet, matchColumn, matchValue, data) {
    const res = await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ sheet, action: "update", matchColumn, matchValue, data }),
    });
    return res.json();
  },
  async remove(sheet, matchColumn, matchValue) {
    const res = await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ sheet, action: "delete", matchColumn, matchValue }),
    });
    return res.json();
  },
};

/* ---- Row <-> app-object converters (sheet headers are the source of truth) ---- */
const itemsToString = (items) => items.map((it) => `${it.qty}x ${it.name}`).join(", ");
const stringToItems = (str) => (str || "").split(",").map((s) => s.trim()).filter(Boolean).map((part) => {
  const m = part.match(/^(\d+)x\s*(.+)$/i);
  return m ? { name: m[2], qty: Number(m[1]) } : { name: part, qty: 1 };
});

const orderMatchesEvent = (order, event) =>
  order.eventId === event.id || (!!order.eventName && order.eventName === event.name);
const orderHasEvent = (order) => !!(order.eventId || order.eventName);

function orderRowToObj(row) {
  return {
    id: row["Order Number"],
    orderNumber: row["Order Number"],
    customerName: row["Customer Name"] || "Walk-in",
    phone: row["Phone"] || "",
    eventName: row["Event"] || "",
    items: stringToItems(row["Items"]),
    notes: row["Notes"] || "",
    subtotal: Number(row["Subtotal"]) || 0,
    tax: Number(row["Tax"]) || 0,
    total: Number(row["Total"]) || 0,
    status: row["Status"] || "New",
    createdAt: row["Created At"] || new Date().toISOString(),
  };
}
function orderObjToRow(order, eventName) {
  return {
    "Order Number": order.orderNumber,
    "Customer Name": order.customerName,
    "Phone": order.phone || "",
    "Event": eventName || "",
    "Date": new Date(order.createdAt).toISOString().slice(0, 10),
    "Time": fmtTime(order.createdAt),
    "Items": itemsToString(order.items),
    "Total Qty": order.items.reduce((s, it) => s + it.qty, 0),
    "Subtotal": order.subtotal,
    "Tax": order.tax,
    "Total": order.total,
    "Status": order.status,
    "Notes": order.notes || "",
    "Created At": order.createdAt,
  };
}
function eventRowToObj(row) {
  return {
    id: row["Event ID"],
    name: row["Event Name"],
    date: row["Date"] ? new Date(row["Date"]) : new Date(),
    time: row["Time"] || "",
    location: row["Location"] || "",
    expectedAttendance: Number(row["Expected Attendance"]) || 0,
    notes: row["Notes"] || "",
  };
}
function eventObjToRow(event) {
  return {
    "Event ID": event.id,
    "Event Name": event.name,
    "Date": new Date(event.date).toISOString().slice(0, 10),
    "Time": event.time || "",
    "Location": event.location || "",
    "Expected Attendance": event.expectedAttendance || 0,
    "Notes": event.notes || "",
  };
}
function menuRowToObj(row) {
  return {
    id: row["Item ID"],
    category: row["Category"],
    name: row["Item Name"],
    description: row["Description"] || "",
    price: Number(row["Price"]) || 0,
    available: String(row["Available"]).toUpperCase() !== "FALSE",
  };
}
function menuObjToRow(item) {
  return {
    "Item ID": item.id,
    "Category": item.category,
    "Item Name": item.name,
    "Description": item.description || "",
    "Price": item.price,
    "Available": item.available,
  };
}

/* ---------------------------- Theme ---------------------------- */
const palette = {
  charcoal: "#1B1612",
  panelDark: "#262019",
  panelDarkAlt: "#2F271D",
  ember: "#E04A1A",
  emberDark: "#B23A18",
  mustard: "#F2B33C",
  cream: "#F3EAD9",
  bgLight: "#F3EAD9",
  panelLight: "#FFFBF2",
  line: "#473A2C",
  lineLight: "#E2D4BA",
  green: "#5C8A52",
  textMutedDark: "#B6A58D",
  textMutedLight: "#7A6A55",
};

function useTheme(dark) {
  return useMemo(() => ({
    dark,
    bg: dark ? palette.charcoal : palette.bgLight,
    panel: dark ? palette.panelDark : palette.panelLight,
    panelAlt: dark ? palette.panelDarkAlt : "#F4ECDA",
    border: dark ? palette.line : palette.lineLight,
    text: dark ? palette.cream : "#2A2118",
    sub: dark ? palette.textMutedDark : palette.textMutedLight,
    ember: palette.ember,
    mustard: palette.mustard,
    green: palette.green,
  }), [dark]);
}

/* ---------------------------- Helpers ---------------------------- */
const pad4 = (n) => String(n).padStart(4, "0");
const money = (n) => `$${(Math.round(n * 100) / 100).toFixed(2)}`;
const dKey = (d) => new Date(d).toDateString();
const sameDay = (a, b) => dKey(a) === dKey(b);
const startOfWeek = (d) => { const x = new Date(d); const day = x.getDay(); x.setDate(x.getDate() - day); x.setHours(0,0,0,0); return x; };
const startOfMonth = (d) => new Date(d.getFullYear(), d.getMonth(), 1);
const startOfYear = (d) => new Date(d.getFullYear(), 0, 1);
const fmtShort = (d) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" });
const fmtFull = (d) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
const fmtTime = (d) => new Date(d).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

/* ---------------------------- Seed Data ---------------------------- */
function seedMenu() {
  const cat = (category, items) => items.map((it) => ({ id: crypto.randomUUID(), category, available: true, ...it }));
  return [
    ...cat("Plates", [
      { name: "Brisket Plate", description: "Sliced smoked brisket, two sides, cornbread", price: 16 },
      { name: "Pulled Pork Plate", description: "Hand-pulled pork shoulder, two sides, cornbread", price: 13 },
      { name: "Half Rack Ribs", description: "Smoked St. Louis ribs, two sides, cornbread", price: 18 },
      { name: "Smoked Chicken Plate", description: "Half chicken, two sides, cornbread", price: 14 },
    ]),
    ...cat("Sandwiches", [
      { name: "Pulled Pork Sandwich", description: "Topped with slaw, brioche bun", price: 9 },
      { name: "Brisket Sandwich", description: "Sliced brisket, brioche bun", price: 11 },
      { name: "Sausage Sandwich", description: "Smoked sausage link, brioche bun", price: 8 },
    ]),
    ...cat("Sides", [
      { name: "Mac & Cheese", description: "Smoked gouda, cavatappi", price: 4 },
      { name: "Collard Greens", description: "Slow cooked, smoked turkey", price: 4 },
      { name: "Baked Beans", description: "Brisket burnt ends, brown sugar", price: 3.5 },
      { name: "Coleslaw", description: "Vinegar-based, fresh cut", price: 3 },
      { name: "Cornbread", description: "Honey butter", price: 2.5 },
    ]),
    ...cat("Drinks", [
      { name: "Sweet Tea", description: "", price: 2.5 },
      { name: "Lemonade", description: "", price: 2.5 },
      { name: "Bottled Water", description: "", price: 1.5 },
      { name: "Canned Soda", description: "", price: 2 },
    ]),
    ...cat("Desserts", [
      { name: "Banana Pudding", description: "", price: 4.5 },
      { name: "Peach Cobbler", description: "Vanilla bean ice cream", price: 5 },
    ]),
  ];
}

function seedEvents(today) {
  const d = (offsetDays) => { const x = new Date(today); x.setDate(x.getDate() + offsetDays); return x; };
  return [
    { id: crypto.randomUUID(), name: "Founders Day Festival", date: d(-8), time: "11:00 AM", location: "Town Square Park", notes: "City-permitted vendor stall, bring extra propane", expectedAttendance: 2000 },
    { id: crypto.randomUUID(), name: "Riverside Food Truck Rally", date: d(6), time: "4:00 PM", location: "Riverside Pavilion", notes: "Power hookup confirmed", expectedAttendance: 800 },
    { id: crypto.randomUUID(), name: "Johnson Wedding Catering", date: d(12), time: "6:00 PM", location: "Magnolia Barn", notes: "Plated service, 120 guests", expectedAttendance: 120 },
    { id: crypto.randomUUID(), name: "Downtown Summer Block Party", date: d(26), time: "2:00 PM", location: "Main St between 4th & 6th", notes: "", expectedAttendance: 1500 },
  ];
}

function seedOrders(menu, events) {
  const names = ["Marcus T.", "Dana W.", "Priya R.", "Leon G.", "Casey M.", "Walk-in", "Jordan B.", "Theo K.", "Walk-in", "Aaliyah F."];
  const pastEvent = events.find((e) => e.date < new Date());
  const orders = [];
  let num = 1;
  const today = new Date();
  for (let dayOffset = 9; dayOffset >= 0; dayOffset--) {
    const day = new Date(today); day.setDate(day.getDate() - dayOffset);
    const count = dayOffset === 9 ? 9 : Math.floor(Math.random() * 6) + 2; // heavier on event day
    for (let i = 0; i < count; i++) {
      const itemCount = Math.floor(Math.random() * 3) + 1;
      const items = [];
      for (let j = 0; j < itemCount; j++) {
        const m = menu[Math.floor(Math.random() * menu.length)];
        const qty = Math.floor(Math.random() * 2) + 1;
        items.push({ itemId: m.id, name: m.name, price: m.price, qty });
      }
      const subtotal = items.reduce((s, it) => s + it.price * it.qty, 0);
      const tax = subtotal * TAX_RATE;
      const hour = 11 + Math.floor(Math.random() * 7);
      const createdAt = new Date(day); createdAt.setHours(hour, Math.floor(Math.random() * 60));
      orders.push({
        id: crypto.randomUUID(),
        orderNumber: pad4(num++),
        customerName: names[Math.floor(Math.random() * names.length)],
        phone: "",
        eventId: dayOffset === 9 && pastEvent ? pastEvent.id : null,
        items,
        notes: "",
        subtotal, tax, total: subtotal + tax,
        status: dayOffset === 0 && i === count - 1 ? "New" : dayOffset === 0 && i === count - 2 ? "In Progress" : "Completed",
        createdAt: createdAt.toISOString(),
      });
    }
  }
  return orders.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
}

/* ============================================================ */

export default function App() {
  const [dark, setDark] = useState(true);
  const T = useTheme(dark);
  const [tab, setTab] = useState("dashboard");
  const [menu, setMenu] = useState([]);
  const [events, setEvents] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeEventId, setActiveEventId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [seeding, setSeeding] = useState(false);

  const loadAll = useCallback(async () => {
    setLoading(true); setLoadError(null);
    try {
      const [menuRows, eventRows, orderRows] = await Promise.all([
        sheetsService.list("Menu"),
        sheetsService.list("Events"),
        sheetsService.list("Orders"),
      ]);
      setMenu(menuRows.map(menuRowToObj));
      setEvents(eventRows.map(eventRowToObj));
      setOrders(orderRows.map(orderRowToObj).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)));
    } catch (err) {
      setLoadError(err.message || "Couldn't reach the spreadsheet");
    }
    setLoading(false);
  }, []);

  useEffect(() => { loadAll(); }, [loadAll]);

  const nextOrderNumber = pad4(orders.length + 1);

  const addOrder = async (order) => {
    const event = events.find((e) => e.id === order.eventId);
    setOrders((prev) => [...prev, order]); // optimistic
    try {
      await sheetsService.append("Orders", orderObjToRow(order, event?.name));
    } catch (err) {
      setLoadError("Order saved locally but failed to sync to the sheet: " + err.message);
    }
  };

  const updateOrderStatus = async (id, status) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    try {
      await sheetsService.update("Orders", "Order Number", id, { Status: status });
    } catch (err) {
      setLoadError("Status updated locally but failed to sync: " + err.message);
    }
  };

  const saveEvent = async (event) => {
    const exists = events.some((e) => e.id === event.id);
    setEvents((prev) => (exists ? prev.map((e) => (e.id === event.id ? event : e)) : [...prev, event]));
    try {
      if (exists) await sheetsService.update("Events", "Event ID", event.id, eventObjToRow(event));
      else await sheetsService.append("Events", eventObjToRow(event));
    } catch (err) {
      setLoadError("Event saved locally but failed to sync: " + err.message);
    }
  };
  const deleteEvent = async (id) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
    try { await sheetsService.remove("Events", "Event ID", id); }
    catch (err) { setLoadError("Deleted locally but failed to sync: " + err.message); }
  };

  const saveMenuItem = async (item) => {
    const exists = menu.some((m) => m.id === item.id);
    setMenu((prev) => (exists ? prev.map((m) => (m.id === item.id ? item : m)) : [...prev, item]));
    try {
      if (exists) await sheetsService.update("Menu", "Item ID", item.id, menuObjToRow(item));
      else await sheetsService.append("Menu", menuObjToRow(item));
    } catch (err) {
      setLoadError("Item saved locally but failed to sync: " + err.message);
    }
  };
  const deleteMenuItem = async (id) => {
    setMenu((prev) => prev.filter((m) => m.id !== id));
    try { await sheetsService.remove("Menu", "Item ID", id); }
    catch (err) { setLoadError("Deleted locally but failed to sync: " + err.message); }
  };
  const toggleMenuAvailable = (id) => {
    const item = menu.find((m) => m.id === id);
    if (item) saveMenuItem({ ...item, available: !item.available });
  };

  const loadStarterMenu = async () => {
    setSeeding(true);
    try {
      const starter = seedMenu();
      for (const item of starter) {
        await sheetsService.append("Menu", menuObjToRow(item));
      }
      await loadAll();
    } catch (err) {
      setLoadError("Couldn't load starter menu: " + err.message);
    }
    setSeeding(false);
  };

  const openEventOrderMode = (eventId) => { setActiveEventId(eventId); setTab("pos"); };

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: Flame },
    { id: "calendar", label: "Events", icon: CalendarIcon },
    { id: "menu", label: "Menu", icon: UtensilsCrossed },
    { id: "pos", label: "POS", icon: ShoppingCart },
    { id: "orders", label: "Orders", icon: ClipboardList },
  ];

  return (
    <div style={{ background: T.bg, color: T.text, minHeight: "100vh" }} className="font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;700&display=swap');
        .font-sans { font-family: 'Inter', sans-serif; }
        .font-display { font-family: 'Oswald', sans-serif; letter-spacing: 0.02em; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
        .ticket-edge { background-image: radial-gradient(circle, ${T.bg} 4px, transparent 5px); background-size: 14px 10px; background-position: -2px -5px; background-repeat: repeat-x; }
        ::-webkit-scrollbar { height: 6px; width: 6px; }
        ::-webkit-scrollbar-thumb { background: ${T.border}; border-radius: 4px; }
        button { font-family: inherit; }
      `}</style>

      {/* Header */}
      <header style={{ borderBottom: `1px solid ${T.border}`, background: T.panel }} className="sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <img src={LOGO_SRC} alt="Poppaz Smoke BBQ" className="h-11 w-auto flex-shrink-0" />
            <div className="leading-tight hidden sm:block">
              <div className="text-xs font-medium" style={{ color: T.sub }}>Operations Dashboard</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={loadAll}
              disabled={loading}
              style={{ borderColor: T.border, color: T.text }}
              className="w-9 h-9 rounded-md border flex items-center justify-center flex-shrink-0"
              aria-label="Refresh from sheet"
              title="Refresh from spreadsheet"
            >
              <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
            </button>
            <button
              onClick={() => setDark((d) => !d)}
              style={{ borderColor: T.border, color: T.text }}
              className="w-9 h-9 rounded-md border flex items-center justify-center flex-shrink-0"
              aria-label="Toggle dark mode"
            >
              {dark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </div>
        </div>
        <nav className="max-w-7xl mx-auto px-4 flex gap-1 overflow-x-auto">
          {navItems.map((n) => {
            const active = tab === n.id;
            return (
              <button
                key={n.id}
                onClick={() => setTab(n.id)}
                className="flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors"
                style={{
                  borderColor: active ? T.ember : "transparent",
                  color: active ? T.ember : T.sub,
                }}
              >
                <n.icon size={15} /> {n.label}
              </button>
            );
          })}
        </nav>
        {loadError && (
          <div className="max-w-7xl mx-auto px-4 pb-2">
            <div style={{ background: `${T.ember}1A`, color: T.ember }} className="rounded-md px-3 py-1.5 text-xs flex items-center justify-between gap-2">
              <span>{loadError}</span>
              <button onClick={() => setLoadError(null)}><X size={12} /></button>
            </div>
          </div>
        )}
      </header>

      <main className="max-w-7xl mx-auto px-4 py-5 pb-16">
        {loading ? (
          <div className="py-24 text-center" style={{ color: T.sub }}>
            <RefreshCw size={22} className="animate-spin mx-auto mb-3" />
            Loading from your spreadsheet…
          </div>
        ) : (
          <>
            {tab === "dashboard" && <DashboardPage T={T} menu={menu} events={events} orders={orders} />}
            {tab === "calendar" && (
              <CalendarPage T={T} events={events} orders={orders} onSaveEvent={saveEvent} onDeleteEvent={deleteEvent} onOpenEventOrderMode={openEventOrderMode} />
            )}
            {tab === "menu" && (
              <MenuPage T={T} menu={menu} onSaveItem={saveMenuItem} onDeleteItem={deleteMenuItem} onToggleAvailable={toggleMenuAvailable} onLoadStarter={loadStarterMenu} seeding={seeding} />
            )}
            {tab === "pos" && (
              <POSPage
                T={T} menu={menu} events={events}
                activeEventId={activeEventId} setActiveEventId={setActiveEventId}
                nextOrderNumber={nextOrderNumber} addOrder={addOrder}
              />
            )}
            {tab === "orders" && <OrdersPage T={T} orders={orders} events={events} updateOrderStatus={updateOrderStatus} />}
          </>
        )}
      </main>
    </div>
  );
}

/* ---------------------------- Shared bits ---------------------------- */

function Card({ T, children, className = "", style = {} }) {
  return (
    <div style={{ background: T.panel, border: `1px solid ${T.border}`, ...style }} className={`rounded-xl p-4 ${className}`}>
      {children}
    </div>
  );
}

function StatusBadge({ T, status }) {
  const map = {
    New: { color: T.ember, label: "New" },
    "In Progress": { color: T.mustard, label: "In Progress" },
    Completed: { color: T.green, label: "Completed" },
  };
  const s = map[status] || map.New;
  return (
    <span
      style={{ color: s.color, borderColor: s.color, background: `${s.color}1A` }}
      className="text-xs font-medium px-2 py-0.5 rounded-full border whitespace-nowrap"
    >
      {s.label}
    </span>
  );
}

/* ---------------------------- Dashboard ---------------------------- */

function DashboardPage({ T, menu, events, orders }) {
  const now = new Date();
  const completed = orders.filter((o) => o.status === "Completed" || o.status === "In Progress" || o.status === "New");

  const sumSince = (since) => orders.filter((o) => new Date(o.createdAt) >= since).reduce((s, o) => s + o.total, 0);
  const todaySales = orders.filter((o) => sameDay(o.createdAt, now)).reduce((s, o) => s + o.total, 0);
  const weekSales = sumSince(startOfWeek(now));
  const monthSales = sumSince(startOfMonth(now));
  const yearSales = sumSince(startOfYear(now));
  const completedOrders = orders.filter((o) => o.status === "Completed");
  const avgOrder = orders.length ? orders.reduce((s, o) => s + o.total, 0) / orders.length : 0;
  const pending = orders.filter((o) => o.status !== "Completed").length;

  const itemQty = {};
  orders.forEach((o) => o.items.forEach((it) => { itemQty[it.name] = (itemQty[it.name] || 0) + it.qty; }));
  const topItems = Object.entries(itemQty).sort((a, b) => b[1] - a[1]).slice(0, 5);

  const eventRevenue = events.map((e) => ({
    name: e.name.split(" ").slice(0, 2).join(" "),
    revenue: orders.filter((o) => orderMatchesEvent(o, e)).reduce((s, o) => s + o.total, 0),
  })).filter((e) => e.revenue > 0);

  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now); d.setDate(d.getDate() - (6 - i));
    const dayOrders = orders.filter((o) => sameDay(o.createdAt, d));
    return { label: fmtShort(d), revenue: Math.round(dayOrders.reduce((s, o) => s + o.total, 0) * 100) / 100, count: dayOrders.length };
  });

  const kpis = [
    { label: "Sales Today", value: money(todaySales) },
    { label: "Sales This Week", value: money(weekSales) },
    { label: "Sales This Month", value: money(monthSales) },
    { label: "Sales This Year", value: money(yearSales) },
    { label: "Avg Order Value", value: money(avgOrder) },
    { label: "Orders Completed", value: completedOrders.length },
    { label: "Pending Orders", value: pending },
    { label: "Total Orders", value: orders.length },
  ];

  const axisStyle = { fontSize: 11, fill: T.sub };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {kpis.map((k) => (
          <Card T={T} key={k.label}>
            <div className="text-xs mb-1" style={{ color: T.sub }}>{k.label}</div>
            <div className="font-display text-2xl font-semibold">{k.value}</div>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card T={T}>
          <div className="font-display text-sm font-semibold mb-3 tracking-wide" style={{ color: T.sub }}>REVENUE — LAST 7 DAYS</div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={last7}>
              <CartesianGrid stroke={T.border} vertical={false} />
              <XAxis dataKey="label" tick={axisStyle} axisLine={{ stroke: T.border }} tickLine={false} />
              <YAxis tick={axisStyle} axisLine={false} tickLine={false} width={40} />
              <Tooltip contentStyle={{ background: T.panelAlt, border: `1px solid ${T.border}`, color: T.text, fontSize: 12 }} formatter={(v) => money(v)} />
              <Line type="monotone" dataKey="revenue" stroke={T.ember} strokeWidth={2.5} dot={{ r: 3, fill: T.ember }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card T={T}>
          <div className="font-display text-sm font-semibold mb-3 tracking-wide" style={{ color: T.sub }}>ORDER VOLUME — LAST 7 DAYS</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={last7}>
              <CartesianGrid stroke={T.border} vertical={false} />
              <XAxis dataKey="label" tick={axisStyle} axisLine={{ stroke: T.border }} tickLine={false} />
              <YAxis tick={axisStyle} axisLine={false} tickLine={false} width={30} allowDecimals={false} />
              <Tooltip contentStyle={{ background: T.panelAlt, border: `1px solid ${T.border}`, color: T.text, fontSize: 12 }} />
              <Bar dataKey="count" fill={T.mustard} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card T={T}>
          <div className="font-display text-sm font-semibold mb-3 tracking-wide" style={{ color: T.sub }}>TOP MENU ITEMS (BY QTY)</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={topItems.map(([name, qty]) => ({ name, qty }))} layout="vertical" margin={{ left: 10 }}>
              <CartesianGrid stroke={T.border} horizontal={false} />
              <XAxis type="number" tick={axisStyle} axisLine={false} tickLine={false} allowDecimals={false} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: T.text }} axisLine={false} tickLine={false} width={120} />
              <Tooltip contentStyle={{ background: T.panelAlt, border: `1px solid ${T.border}`, color: T.text, fontSize: 12 }} />
              <Bar dataKey="qty" fill={T.ember} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card T={T}>
          <div className="font-display text-sm font-semibold mb-3 tracking-wide" style={{ color: T.sub }}>REVENUE BY EVENT</div>
          {eventRevenue.length === 0 ? (
            <div className="text-sm py-12 text-center" style={{ color: T.sub }}>No event orders yet — orders placed in Event Order Mode will show up here.</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={eventRevenue}>
                <CartesianGrid stroke={T.border} vertical={false} />
                <XAxis dataKey="name" tick={axisStyle} axisLine={{ stroke: T.border }} tickLine={false} />
                <YAxis tick={axisStyle} axisLine={false} tickLine={false} width={40} />
                <Tooltip contentStyle={{ background: T.panelAlt, border: `1px solid ${T.border}`, color: T.text, fontSize: 12 }} formatter={(v) => money(v)} />
                <Bar dataKey="revenue" fill={T.green} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>
      </div>
    </div>
  );
}

/* ---------------------------- Calendar / Events ---------------------------- */

function CalendarPage({ T, events, orders, onSaveEvent, onDeleteEvent, onOpenEventOrderMode }) {
  const [monthCursor, setMonthCursor] = useState(startOfMonth(new Date()));
  const [editing, setEditing] = useState(null); // event object or "new" or null
  const [detail, setDetail] = useState(null); // event for metrics panel

  const first = startOfMonth(monthCursor);
  const startDay = first.getDay();
  const daysInMonth = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < startDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(first.getFullYear(), first.getMonth(), d));

  const eventsOnDay = (day) => events.filter((e) => day && sameDay(e.date, day));
  const upcoming = [...events].filter((e) => new Date(e.date) >= new Date(new Date().toDateString())).sort((a, b) => new Date(a.date) - new Date(b.date));

  const saveEvent = (ev) => {
    onSaveEvent(ev);
    setEditing(null);
  };
  const deleteEvent = (id) => {
    onDeleteEvent(id);
    setDetail(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-semibold">Event Calendar</h2>
        <button onClick={() => setEditing("new")} style={{ background: T.ember }} className="text-white text-sm font-medium px-3 py-2 rounded-md flex items-center gap-1.5">
          <Plus size={15} /> Add Event
        </button>
      </div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-4">
        <Card T={T}>
          <div className="flex items-center justify-between mb-3">
            <button onClick={() => setMonthCursor(new Date(monthCursor.getFullYear(), monthCursor.getMonth() - 1, 1))} style={{ borderColor: T.border }} className="p-1.5 rounded border"><ChevronLeft size={15} /></button>
            <div className="font-display font-semibold">{monthCursor.toLocaleDateString("en-US", { month: "long", year: "numeric" })}</div>
            <button onClick={() => setMonthCursor(new Date(monthCursor.getFullYear(), monthCursor.getMonth() + 1, 1))} style={{ borderColor: T.border }} className="p-1.5 rounded border"><ChevronRight size={15} /></button>
          </div>
          <div className="grid grid-cols-7 text-center text-xs mb-1" style={{ color: T.sub }}>
            {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => <div key={i} className="py-1">{d}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {cells.map((day, i) => {
              const dayEvents = eventsOnDay(day);
              const isToday = day && sameDay(day, new Date());
              return (
                <div key={i} style={{ borderColor: T.border, background: isToday ? `${T.ember}14` : "transparent" }}
                  className="min-h-[60px] sm:min-h-[72px] border rounded-md p-1 text-xs">
                  {day && <div style={{ color: isToday ? T.ember : T.sub }} className="font-medium mb-1">{day.getDate()}</div>}
                  {dayEvents.map((e) => (
                    <button key={e.id} onClick={() => setDetail(e)} style={{ background: T.ember }}
                      className="w-full text-left text-white rounded px-1 py-0.5 mb-0.5 truncate text-[10px] leading-tight">
                      {e.name}
                    </button>
                  ))}
                </div>
              );
            })}
          </div>
        </Card>

        <Card T={T}>
          <div className="font-display text-sm font-semibold mb-3 tracking-wide" style={{ color: T.sub }}>UPCOMING EVENTS</div>
          <div className="space-y-2">
            {upcoming.length === 0 && <div className="text-sm" style={{ color: T.sub }}>No upcoming events.</div>}
            {upcoming.map((e) => (
              <button key={e.id} onClick={() => setDetail(e)} style={{ borderColor: T.border }} className="w-full text-left border rounded-md p-2.5 hover:opacity-80">
                <div className="font-medium text-sm">{e.name}</div>
                <div className="text-xs flex items-center gap-1 mt-0.5" style={{ color: T.sub }}><Clock size={11} /> {fmtFull(e.date)} · {e.time}</div>
              </button>
            ))}
          </div>
        </Card>
      </div>

      {detail && (
        <EventDetailModal
          T={T} event={detail} orders={orders}
          onClose={() => setDetail(null)}
          onEdit={() => { setEditing(detail); setDetail(null); }}
          onDelete={() => deleteEvent(detail.id)}
          onOpenEventOrderMode={() => onOpenEventOrderMode(detail.id)}
        />
      )}
      {editing && (
        <EventFormModal T={T} event={editing === "new" ? null : editing} onSave={saveEvent} onClose={() => setEditing(null)} />
      )}
    </div>
  );
}

function ModalShell({ T, title, onClose, children, wide }) {
  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.55)" }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: T.panel, border: `1px solid ${T.border}` }}
        className={`rounded-xl w-full ${wide ? "max-w-lg" : "max-w-md"} max-h-[88vh] overflow-y-auto p-5`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-lg font-semibold">{title}</h3>
          <button onClick={onClose} style={{ color: T.sub }}><X size={18} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Field({ T, label, children }) {
  return (
    <label className="block mb-3">
      <span className="text-xs font-medium block mb-1" style={{ color: T.sub }}>{label}</span>
      {children}
    </label>
  );
}

function inputStyle(T) {
  return { background: T.panelAlt, border: `1px solid ${T.border}`, color: T.text };
}

function EventFormModal({ T, event, onSave, onClose }) {
  const [form, setForm] = useState(() => event ? {
    ...event, date: new Date(event.date).toISOString().slice(0, 10),
  } : { name: "", date: new Date().toISOString().slice(0, 10), time: "12:00 PM", location: "", notes: "", expectedAttendance: "" });

  const submit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    onSave({ id: event?.id || crypto.randomUUID(), ...form, date: new Date(form.date), expectedAttendance: Number(form.expectedAttendance) || 0 });
  };

  return (
    <ModalShell T={T} title={event ? "Edit Event" : "Add Event"} onClose={onClose}>
      <form onSubmit={submit}>
        <Field T={T} label="Event name">
          <input required style={inputStyle(T)} className="w-full rounded-md px-3 py-2 text-sm" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field T={T} label="Date">
            <input type="date" required style={inputStyle(T)} className="w-full rounded-md px-3 py-2 text-sm" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          </Field>
          <Field T={T} label="Time">
            <input style={inputStyle(T)} className="w-full rounded-md px-3 py-2 text-sm" placeholder="6:00 PM" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
          </Field>
        </div>
        <Field T={T} label="Location">
          <input style={inputStyle(T)} className="w-full rounded-md px-3 py-2 text-sm" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
        </Field>
        <Field T={T} label="Expected attendance">
          <input type="number" min="0" style={inputStyle(T)} className="w-full rounded-md px-3 py-2 text-sm" value={form.expectedAttendance} onChange={(e) => setForm({ ...form, expectedAttendance: e.target.value })} />
        </Field>
        <Field T={T} label="Notes">
          <textarea style={inputStyle(T)} rows={2} className="w-full rounded-md px-3 py-2 text-sm" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
        </Field>
        <button type="submit" style={{ background: T.ember }} className="w-full text-white font-medium py-2.5 rounded-md text-sm mt-1">
          Save Event
        </button>
      </form>
    </ModalShell>
  );
}

function EventDetailModal({ T, event, orders, onClose, onEdit, onDelete, onOpenEventOrderMode }) {
  const evOrders = orders.filter((o) => orderMatchesEvent(o, event));
  const revenue = evOrders.reduce((s, o) => s + o.total, 0);
  const avg = evOrders.length ? revenue / evOrders.length : 0;
  const itemQty = {};
  evOrders.forEach((o) => o.items.forEach((it) => { itemQty[it.name] = (itemQty[it.name] || 0) + it.qty; }));
  const top = Object.entries(itemQty).sort((a, b) => b[1] - a[1]).slice(0, 3);

  return (
    <ModalShell T={T} title={event.name} onClose={onClose}>
      <div className="space-y-1.5 text-sm mb-4" style={{ color: T.sub }}>
        <div className="flex items-center gap-1.5"><Clock size={13} /> {fmtFull(event.date)} · {event.time}</div>
        {event.location && <div className="flex items-center gap-1.5"><MapPin size={13} /> {event.location}</div>}
        {!!event.expectedAttendance && <div className="flex items-center gap-1.5"><Users size={13} /> ~{event.expectedAttendance} expected</div>}
        {event.notes && <div className="pt-1">{event.notes}</div>}
      </div>

      <div className="grid grid-cols-3 gap-2 mb-4">
        <div style={{ background: T.panelAlt }} className="rounded-md p-2.5 text-center">
          <div className="font-display text-lg font-semibold">{money(revenue)}</div>
          <div className="text-[11px]" style={{ color: T.sub }}>Revenue</div>
        </div>
        <div style={{ background: T.panelAlt }} className="rounded-md p-2.5 text-center">
          <div className="font-display text-lg font-semibold">{evOrders.length}</div>
          <div className="text-[11px]" style={{ color: T.sub }}>Orders</div>
        </div>
        <div style={{ background: T.panelAlt }} className="rounded-md p-2.5 text-center">
          <div className="font-display text-lg font-semibold">{money(avg)}</div>
          <div className="text-[11px]" style={{ color: T.sub }}>Avg Order</div>
        </div>
      </div>

      {top.length > 0 && (
        <div className="mb-4">
          <div className="text-xs font-medium mb-1.5" style={{ color: T.sub }}>TOP ITEMS</div>
          {top.map(([name, qty]) => (
            <div key={name} className="flex justify-between text-sm py-0.5">
              <span>{name}</span><span style={{ color: T.sub }}>{qty} sold</span>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <button onClick={onOpenEventOrderMode} style={{ background: T.ember }} className="flex-1 text-white text-sm font-medium py-2 rounded-md flex items-center justify-center gap-1.5">
          <ShoppingCart size={14} /> Open Event Order Mode
        </button>
        <button onClick={onEdit} style={{ borderColor: T.border }} className="px-3 rounded-md border"><Pencil size={14} /></button>
        <button onClick={onDelete} style={{ borderColor: T.border, color: T.ember }} className="px-3 rounded-md border"><Trash2 size={14} /></button>
      </div>
    </ModalShell>
  );
}

/* ---------------------------- Menu Management ---------------------------- */

function MenuPage({ T, menu, onSaveItem, onDeleteItem, onToggleAvailable, onLoadStarter, seeding }) {
  const [editing, setEditing] = useState(null);
  const categories = [...new Set(menu.map((m) => m.category))];

  const save = (item) => { onSaveItem(item); setEditing(null); };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-semibold">Menu Management</h2>
        <button onClick={() => setEditing("new")} style={{ background: T.ember }} className="text-white text-sm font-medium px-3 py-2 rounded-md flex items-center gap-1.5">
          <Plus size={15} /> Add Item
        </button>
      </div>

      {menu.length === 0 && (
        <Card T={T} className="text-center py-10">
          <div className="text-sm mb-3" style={{ color: T.sub }}>Your Menu sheet is empty. Load a starter BBQ menu to get going, then edit it to match your real menu.</div>
          <button onClick={onLoadStarter} disabled={seeding} style={{ background: T.ember }} className="text-white text-sm font-medium px-4 py-2 rounded-md inline-flex items-center gap-1.5">
            {seeding ? <RefreshCw size={14} className="animate-spin" /> : <Plus size={14} />}
            {seeding ? "Loading…" : "Load starter menu"}
          </button>
        </Card>
      )}

      {categories.map((cat) => (
        <div key={cat}>
          <div className="font-display text-sm font-semibold mb-2 tracking-wide" style={{ color: T.sub }}>{cat.toUpperCase()}</div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {menu.filter((m) => m.category === cat).map((m) => (
              <Card T={T} key={m.id} style={{ opacity: m.available ? 1 : 0.5 }}>
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <div className="font-medium text-sm">{m.name}</div>
                    {m.description && <div className="text-xs mt-0.5" style={{ color: T.sub }}>{m.description}</div>}
                  </div>
                  <div className="font-mono font-semibold text-sm whitespace-nowrap">{money(m.price)}</div>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <button onClick={() => onToggleAvailable(m.id)} className="text-xs flex items-center gap-1" style={{ color: m.available ? T.green : T.sub }}>
                    <span style={{ background: m.available ? T.green : T.sub }} className="w-1.5 h-1.5 rounded-full inline-block" />
                    {m.available ? "Available" : "Unavailable"}
                  </button>
                  <div className="flex gap-2">
                    <button onClick={() => setEditing(m)} style={{ color: T.sub }}><Pencil size={14} /></button>
                    <button onClick={() => onDeleteItem(m.id)} style={{ color: T.ember }}><Trash2 size={14} /></button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      ))}

      {editing && (
        <ItemFormModal T={T} item={editing === "new" ? null : editing} categories={categories} onSave={save} onClose={() => setEditing(null)} />
      )}
    </div>
  );
}

function ItemFormModal({ T, item, categories, onSave, onClose }) {
  const [form, setForm] = useState(() => item || { name: "", category: categories[0] || "", description: "", price: "", available: true });
  const [newCat, setNewCat] = useState("");

  const submit = (e) => {
    e.preventDefault();
    const category = form.category === "__new__" ? newCat.trim() : form.category;
    if (!form.name.trim() || !category) return;
    onSave({ id: item?.id || crypto.randomUUID(), ...form, category, price: Number(form.price) || 0 });
  };

  return (
    <ModalShell T={T} title={item ? "Edit Item" : "Add Menu Item"} onClose={onClose}>
      <form onSubmit={submit}>
        <Field T={T} label="Item name">
          <input required style={inputStyle(T)} className="w-full rounded-md px-3 py-2 text-sm" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </Field>
        <Field T={T} label="Category">
          <select style={inputStyle(T)} className="w-full rounded-md px-3 py-2 text-sm" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            <option value="__new__">+ New category…</option>
          </select>
        </Field>
        {form.category === "__new__" && (
          <Field T={T} label="New category name">
            <input style={inputStyle(T)} className="w-full rounded-md px-3 py-2 text-sm" value={newCat} onChange={(e) => setNewCat(e.target.value)} />
          </Field>
        )}
        <Field T={T} label="Description">
          <input style={inputStyle(T)} className="w-full rounded-md px-3 py-2 text-sm" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </Field>
        <Field T={T} label="Price ($)">
          <input type="number" min="0" step="0.01" required style={inputStyle(T)} className="w-full rounded-md px-3 py-2 text-sm" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
        </Field>
        <button type="submit" style={{ background: T.ember }} className="w-full text-white font-medium py-2.5 rounded-md text-sm mt-1">Save Item</button>
      </form>
    </ModalShell>
  );
}

/* ---------------------------- POS ---------------------------- */

function POSPage({ T, menu, events, activeEventId, setActiveEventId, nextOrderNumber, addOrder }) {
  const available = menu.filter((m) => m.available);
  const categories = [...new Set(available.map((m) => m.category))];
  const [cat, setCat] = useState(categories[0] || "");
  const [cart, setCart] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [confirmation, setConfirmation] = useState(null);

  const activeEvent = events.find((e) => e.id === activeEventId);

  const addToCart = (item) => setCart((prev) => {
    const existing = prev.find((c) => c.itemId === item.id);
    if (existing) return prev.map((c) => (c.itemId === item.id ? { ...c, qty: c.qty + 1 } : c));
    return [...prev, { itemId: item.id, name: item.name, price: item.price, qty: 1 }];
  });
  const changeQty = (itemId, delta) => setCart((prev) => prev
    .map((c) => (c.itemId === itemId ? { ...c, qty: c.qty + delta } : c))
    .filter((c) => c.qty > 0));
  const removeItem = (itemId) => setCart((prev) => prev.filter((c) => c.itemId !== itemId));

  const subtotal = cart.reduce((s, c) => s + c.price * c.qty, 0);
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;

  const completeOrder = () => {
    if (cart.length === 0) return;
    const event = events.find((e) => e.id === activeEventId);
    const order = {
      id: nextOrderNumber, orderNumber: nextOrderNumber,
      customerName: customerName.trim() || "Walk-in", phone,
      eventId: activeEventId || null, eventName: event?.name || "", items: cart, notes,
      subtotal, tax, total, status: "New", createdAt: new Date().toISOString(),
    };
    addOrder(order);
    setConfirmation(order);
    setCart([]); setCustomerName(""); setPhone(""); setNotes("");
  };

  return (
    <div className="space-y-3">
      {activeEvent && (
        <div style={{ background: `${T.ember}1A`, borderColor: T.ember }} className="border rounded-md px-3 py-2 flex items-center justify-between text-sm">
          <span className="flex items-center gap-1.5" style={{ color: T.ember }}><CalendarIcon size={14} /> Event Order Mode — <strong>{activeEvent.name}</strong></span>
          <button onClick={() => setActiveEventId(null)} className="text-xs underline" style={{ color: T.ember }}>Exit</button>
        </div>
      )}

      <div className="grid lg:grid-cols-[1fr_340px] gap-4">
        <div>
          <div className="flex gap-1.5 overflow-x-auto pb-2 mb-2">
            {categories.map((c) => (
              <button key={c} onClick={() => setCat(c)}
                style={{ background: cat === c ? T.ember : T.panel, color: cat === c ? "#fff" : T.text, border: `1px solid ${cat === c ? T.ember : T.border}` }}
                className="px-3 py-1.5 rounded-full text-sm whitespace-nowrap font-medium">
                {c}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {available.filter((m) => m.category === cat).map((m) => (
              <button key={m.id} onClick={() => addToCart(m)} style={{ background: T.panel, border: `1px solid ${T.border}` }}
                className="text-left rounded-lg p-3 hover:opacity-80 active:scale-[0.98] transition">
                <div className="text-sm font-medium leading-snug">{m.name}</div>
                <div className="font-mono text-sm mt-1.5" style={{ color: T.ember }}>{money(m.price)}</div>
              </button>
            ))}
          </div>
        </div>

        <Card T={T} className="lg:sticky lg:top-32 self-start">
          <div className="font-display text-sm font-semibold mb-3 flex items-center justify-between">
            <span>ORDER <span className="font-mono" style={{ color: T.ember }}>#{nextOrderNumber}</span></span>
            <ReceiptText size={16} style={{ color: T.sub }} />
          </div>

          <input placeholder="Customer name" style={inputStyle(T)} className="w-full rounded-md px-3 py-2 text-sm mb-2" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
          <input placeholder="Phone (optional)" style={inputStyle(T)} className="w-full rounded-md px-3 py-2 text-sm mb-3" value={phone} onChange={(e) => setPhone(e.target.value)} />

          <div className="space-y-2 mb-3 max-h-[260px] overflow-y-auto">
            {cart.length === 0 && <div className="text-sm py-6 text-center" style={{ color: T.sub }}>Tap menu items to add them here.</div>}
            {cart.map((c) => (
              <div key={c.itemId} className="flex items-center justify-between gap-2 text-sm">
                <div className="flex-1">
                  <div>{c.name}</div>
                  <div className="font-mono text-xs" style={{ color: T.sub }}>{money(c.price)} ea</div>
                </div>
                <div className="flex items-center gap-1.5">
                  <button onClick={() => changeQty(c.itemId, -1)} style={{ borderColor: T.border }} className="w-6 h-6 rounded border flex items-center justify-center"><Minus size={11} /></button>
                  <span className="w-5 text-center font-mono">{c.qty}</span>
                  <button onClick={() => changeQty(c.itemId, 1)} style={{ borderColor: T.border }} className="w-6 h-6 rounded border flex items-center justify-center"><Plus size={11} /></button>
                  <button onClick={() => removeItem(c.itemId)} style={{ color: T.ember }} className="ml-1"><X size={13} /></button>
                </div>
              </div>
            ))}
          </div>

          <textarea placeholder="Order notes / special instructions" style={inputStyle(T)} rows={2} className="w-full rounded-md px-3 py-2 text-sm mb-3" value={notes} onChange={(e) => setNotes(e.target.value)} />

          <div className="border-t pt-2 space-y-1 text-sm" style={{ borderColor: T.border }}>
            <div className="flex justify-between"><span style={{ color: T.sub }}>Subtotal</span><span className="font-mono">{money(subtotal)}</span></div>
            <div className="flex justify-between"><span style={{ color: T.sub }}>Tax</span><span className="font-mono">{money(tax)}</span></div>
            <div className="flex justify-between font-semibold text-base pt-1"><span>Total</span><span className="font-mono">{money(total)}</span></div>
          </div>

          <button onClick={completeOrder} disabled={cart.length === 0} style={{ background: cart.length ? T.ember : T.border }}
            className="w-full text-white font-medium py-2.5 rounded-md text-sm mt-3 disabled:cursor-not-allowed">
            Complete Order
          </button>
        </Card>
      </div>

      {confirmation && (
        <ModalShell T={T} title="Order placed" onClose={() => setConfirmation(null)}>
          <div className="text-center py-2">
            <CheckCircle2 size={36} style={{ color: T.green }} className="mx-auto mb-2" />
            <div className="font-mono text-2xl font-semibold mb-1">#{confirmation.orderNumber}</div>
            <div className="text-sm" style={{ color: T.sub }}>{confirmation.customerName} · {money(confirmation.total)}</div>
          </div>
          <button onClick={() => setConfirmation(null)} style={{ background: T.ember }} className="w-full text-white font-medium py-2.5 rounded-md text-sm mt-3">Start Next Order</button>
        </ModalShell>
      )}
    </div>
  );
}

/* ---------------------------- Orders ---------------------------- */

function OrdersPage({ T, orders, events, updateOrderStatus }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [eventFilter, setEventFilter] = useState("All");

  const filtered = [...orders].reverse().filter((o) => {
    const matchesSearch = !search || o.orderNumber.includes(search) || o.customerName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || o.status === statusFilter;
    const matchesEvent = eventFilter === "All" || (eventFilter === "None" ? !orderHasEvent(o) : orderMatchesEvent(o, events.find((e) => e.id === eventFilter) || {}));
    return matchesSearch && matchesStatus && matchesEvent;
  });

  const nextStatus = { New: "In Progress", "In Progress": "Completed", Completed: "Completed" };

  return (
    <div className="space-y-4">
      <h2 className="font-display text-xl font-semibold">Order History</h2>

      <div className="flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-[180px]">
          <Search size={14} style={{ color: T.sub }} className="absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input placeholder="Search order # or customer" style={inputStyle(T)} className="w-full rounded-md pl-8 pr-3 py-2 text-sm" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select style={inputStyle(T)} className="rounded-md px-2 py-2 text-sm" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          {["All", "New", "In Progress", "Completed"].map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select style={inputStyle(T)} className="rounded-md px-2 py-2 text-sm" value={eventFilter} onChange={(e) => setEventFilter(e.target.value)}>
          <option value="All">All orders</option>
          <option value="None">No event (regular)</option>
          {events.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
        </select>
      </div>

      <div className="space-y-2">
        {filtered.length === 0 && <div className="text-sm py-10 text-center" style={{ color: T.sub }}>No orders match your filters.</div>}
        {filtered.map((o) => {
          const event = events.find((e) => e.id === o.eventId) || events.find((e) => e.name === o.eventName);
          return (
            <Card T={T} key={o.id}>
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-semibold text-sm">#{o.orderNumber}</span>
                    <StatusBadge T={T} status={o.status} />
                  </div>
                  <div className="text-sm mt-1">{o.customerName}{event && <span style={{ color: T.sub }}> · {event.name}</span>}</div>
                  <div className="text-xs mt-0.5" style={{ color: T.sub }}>{fmtFull(o.createdAt)} · {fmtTime(o.createdAt)}</div>
                  <div className="text-xs mt-1" style={{ color: T.sub }}>{o.items.map((it) => `${it.qty}× ${it.name}`).join(", ")}</div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="font-mono font-semibold">{money(o.total)}</div>
                  {o.status !== "Completed" && (
                    <button onClick={() => updateOrderStatus(o.id, nextStatus[o.status])} style={{ color: T.ember }} className="text-xs underline mt-1.5">
                      Mark {nextStatus[o.status]}
                    </button>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}